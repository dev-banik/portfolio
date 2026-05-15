using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Skills;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public SkillsController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SkillCategoryDto>>>> GetCategories()
    {
        var cats = await _uow.SkillCategories.Query()
            .Where(c => c.IsActive)
            .Include(c => c.Skills.Where(s => s.IsActive))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<SkillCategoryDto>>.Ok(_mapper.Map<IEnumerable<SkillCategoryDto>>(cats)));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<SkillDto>>>> GetSkills([FromQuery] Guid? categoryId)
    {
        var query = _uow.Skills.Query()
            .Include(s => s.Category)
            .Where(s => s.IsActive);

        if (categoryId.HasValue)
            query = query.Where(s => s.CategoryId == categoryId);

        var skills = await query.OrderBy(s => s.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<SkillDto>>.Ok(_mapper.Map<IEnumerable<SkillDto>>(skills)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<SkillCategoryDto>>> CreateCategory([FromBody] CreateSkillCategoryRequest request)
    {
        var entity = _mapper.Map<SkillCategory>(request);
        await _uow.SkillCategories.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategories), ApiResponse<SkillCategoryDto>.Ok(_mapper.Map<SkillCategoryDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("categories/{id}")]
    public async Task<ActionResult<ApiResponse<SkillCategoryDto>>> UpdateCategory(Guid id, [FromBody] UpdateSkillCategoryRequest request)
    {
        var entity = await _uow.SkillCategories.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<SkillCategoryDto>.Fail("Category not found."));
        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        await _uow.SkillCategories.UpdateAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<SkillCategoryDto>.Ok(_mapper.Map<SkillCategoryDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(Guid id)
    {
        var entity = await _uow.SkillCategories.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Category not found."));
        await _uow.SkillCategories.DeleteAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<SkillDto>>> CreateSkill([FromBody] CreateSkillRequest request)
    {
        var entity = _mapper.Map<Skill>(request);
        await _uow.Skills.AddAsync(entity);
        await _uow.SaveChangesAsync();
        await _uow.Skills.Query().Include(s => s.Category).FirstOrDefaultAsync(s => s.Id == entity.Id);
        return CreatedAtAction(nameof(GetSkills), ApiResponse<SkillDto>.Ok(_mapper.Map<SkillDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<SkillDto>>> UpdateSkill(Guid id, [FromBody] UpdateSkillRequest request)
    {
        var entity = await _uow.Skills.Query().Include(s => s.Category).FirstOrDefaultAsync(s => s.Id == id);
        if (entity == null) return NotFound(ApiResponse<SkillDto>.Fail("Skill not found."));
        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Skills.UpdateAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<SkillDto>.Ok(_mapper.Map<SkillDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSkill(Guid id)
    {
        var entity = await _uow.Skills.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Skill not found."));
        await _uow.Skills.DeleteAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
