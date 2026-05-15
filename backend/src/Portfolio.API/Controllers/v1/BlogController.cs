using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Blog;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public BlogController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<BlogCategoryDto>>>> GetCategories()
    {
        var items = await _uow.BlogCategories.Query()
            .Where(c => c.IsActive)
            .Include(c => c.Blogs.Where(b => b.IsActive && b.IsPublished))
            .OrderBy(c => c.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<BlogCategoryDto>>.Ok(_mapper.Map<IEnumerable<BlogCategoryDto>>(items)));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<BlogListDto>>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 6,
        [FromQuery] string? search = null, [FromQuery] Guid? categoryId = null,
        [FromQuery] string? tag = null, [FromQuery] bool adminView = false)
    {
        var query = _uow.Blogs.Query()
            .Include(b => b.Category)
            .Where(b => b.IsActive);

        if (!adminView) query = query.Where(b => b.IsPublished);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(b => b.Title.Contains(search) || b.Excerpt.Contains(search));
        if (categoryId.HasValue) query = query.Where(b => b.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(tag)) query = query.Where(b => b.Tags != null && b.Tags.Contains(tag));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(ApiResponse<PagedResult<BlogListDto>>.Ok(new PagedResult<BlogListDto>
        {
            Data = _mapper.Map<IEnumerable<BlogListDto>>(items),
            TotalCount = total, Page = page, PageSize = pageSize
        }));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<BlogDto>>> GetBySlug(string slug)
    {
        var item = await _uow.Blogs.Query()
            .Include(b => b.Category)
            .Include(b => b.Comments.Where(c => c.IsApproved && c.ParentId == null))
                .ThenInclude(c => c.Replies.Where(r => r.IsApproved))
            .FirstOrDefaultAsync(b => b.Slug == slug && b.IsActive);

        if (item == null) return NotFound(ApiResponse<BlogDto>.Fail("Blog not found."));
        item.ViewCount++;
        await _uow.Blogs.UpdateAsync(item);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<BlogDto>.Ok(_mapper.Map<BlogDto>(item)));
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<ApiResponse<CommentDto>>> AddComment(Guid id, [FromBody] CreateCommentRequest request)
    {
        request.BlogId = id;
        var entity = _mapper.Map<Comment>(request);
        await _uow.Comments.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), ApiResponse<CommentDto>.Ok(_mapper.Map<CommentDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BlogDto>>> Create([FromBody] CreateBlogRequest request)
    {
        var entity = _mapper.Map<Blog>(request);
        entity.Slug = await GenerateUniqueSlug(entity.Slug);
        if (request.IsPublished && entity.PublishedAt == null)
            entity.PublishedAt = DateTime.UtcNow;
        await _uow.Blogs.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = entity.Slug }, ApiResponse<BlogDto>.Ok(_mapper.Map<BlogDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<BlogDto>>> Update(Guid id, [FromBody] UpdateBlogRequest request)
    {
        var entity = await _uow.Blogs.Query().Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);
        if (entity == null) return NotFound(ApiResponse<BlogDto>.Fail("Not found."));
        _mapper.Map(request, entity);
        if (request.IsPublished && entity.PublishedAt == null) entity.PublishedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Blogs.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<BlogDto>.Ok(_mapper.Map<BlogDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Blogs.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Blogs.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("comments/{id}/approve")]
    public async Task<ActionResult<ApiResponse<bool>>> ApproveComment(Guid id)
    {
        var comment = await _uow.Comments.GetByIdAsync(id);
        if (comment == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        comment.IsApproved = true; comment.UpdatedAt = DateTime.UtcNow;
        await _uow.Comments.UpdateAsync(comment); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    private async Task<string> GenerateUniqueSlug(string baseSlug)
    {
        var slug = baseSlug; var count = 1;
        while (await _uow.Blogs.ExistsAsync(b => b.Slug == slug))
            slug = $"{baseSlug}-{count++}";
        return slug;
    }
}
