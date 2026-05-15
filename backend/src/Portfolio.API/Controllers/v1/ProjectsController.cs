using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Projects;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ProjectsController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectCategoryDto>>>> GetCategories()
    {
        var items = await _uow.ProjectCategories.Query()
            .Where(c => c.IsActive)
            .Include(c => c.Projects.Where(p => p.IsActive))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<ProjectCategoryDto>>.Ok(_mapper.Map<IEnumerable<ProjectCategoryDto>>(items)));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ProjectDto>>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 9,
        [FromQuery] string? search = null, [FromQuery] Guid? categoryId = null,
        [FromQuery] bool? featured = null)
    {
        var query = _uow.Projects.Query()
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Title.Contains(search) || p.ShortDescription.Contains(search));
        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);
        if (featured.HasValue)
            query = query.Where(p => p.IsFeatured == featured.Value);

        var total = await query.CountAsync();
        var items = await query.OrderBy(p => p.DisplayOrder).ThenByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(ApiResponse<PagedResult<ProjectDto>>.Ok(new PagedResult<ProjectDto>
        {
            Data = _mapper.Map<IEnumerable<ProjectDto>>(items),
            TotalCount = total, Page = page, PageSize = pageSize
        }));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> GetBySlug(string slug)
    {
        var item = await _uow.Projects.Query()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

        if (item == null) return NotFound(ApiResponse<ProjectDto>.Fail("Project not found."));
        item.ViewCount++;
        await _uow.Projects.UpdateAsync(item);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<ProjectDto>.Ok(_mapper.Map<ProjectDto>(item)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<ProjectCategoryDto>>> CreateCategory([FromBody] CreateProjectCategoryRequest req)
    {
        var entity = _mapper.Map<ProjectCategory>(req);
        await _uow.ProjectCategories.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategories), ApiResponse<ProjectCategoryDto>.Ok(_mapper.Map<ProjectCategoryDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("categories/{id}")]
    public async Task<ActionResult<ApiResponse<ProjectCategoryDto>>> UpdateCategory(Guid id, [FromBody] UpdateProjectCategoryRequest req)
    {
        var entity = await _uow.ProjectCategories.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<ProjectCategoryDto>.Fail("Not found."));
        _mapper.Map(req, entity); entity.UpdatedAt = DateTime.UtcNow;
        await _uow.ProjectCategories.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<ProjectCategoryDto>.Ok(_mapper.Map<ProjectCategoryDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(Guid id)
    {
        var entity = await _uow.ProjectCategories.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.ProjectCategories.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Create([FromBody] CreateProjectRequest request)
    {
        var entity = _mapper.Map<Project>(request);
        entity.Slug = await GenerateUniqueSlug(entity.Slug);
        await _uow.Projects.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = entity.Slug }, ApiResponse<ProjectDto>.Ok(_mapper.Map<ProjectDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Update(Guid id, [FromBody] UpdateProjectRequest request)
    {
        var entity = await _uow.Projects.Query().Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (entity == null) return NotFound(ApiResponse<ProjectDto>.Fail("Not found."));
        _mapper.Map(request, entity); entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Projects.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<ProjectDto>.Ok(_mapper.Map<ProjectDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Projects.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Projects.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    private async Task<string> GenerateUniqueSlug(string baseSlug)
    {
        var slug = baseSlug;
        var count = 1;
        while (await _uow.Projects.ExistsAsync(p => p.Slug == slug))
            slug = $"{baseSlug}-{count++}";
        return slug;
    }
}
