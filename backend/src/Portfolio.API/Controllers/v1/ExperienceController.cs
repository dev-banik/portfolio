using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Experience;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class ExperienceController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ExperienceController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ExperienceDto>>>> GetAll()
    {
        var items = await _uow.Experiences.Query()
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<ExperienceDto>>.Ok(_mapper.Map<IEnumerable<ExperienceDto>>(items)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> GetById(Guid id)
    {
        var item = await _uow.Experiences.GetByIdAsync(id);
        if (item == null) return NotFound(ApiResponse<ExperienceDto>.Fail("Not found."));
        return Ok(ApiResponse<ExperienceDto>.Ok(_mapper.Map<ExperienceDto>(item)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> Create([FromBody] CreateExperienceRequest request)
    {
        var entity = _mapper.Map<Experience>(request);
        await _uow.Experiences.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, ApiResponse<ExperienceDto>.Ok(_mapper.Map<ExperienceDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> Update(Guid id, [FromBody] UpdateExperienceRequest request)
    {
        var entity = await _uow.Experiences.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<ExperienceDto>.Fail("Not found."));
        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Experiences.UpdateAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<ExperienceDto>.Ok(_mapper.Map<ExperienceDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Experiences.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Experiences.DeleteAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
