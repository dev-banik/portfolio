using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Education;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public EducationController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<EducationDto>>>> GetAll()
    {
        var items = await _uow.Educations.Query()
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<EducationDto>>.Ok(_mapper.Map<IEnumerable<EducationDto>>(items)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> GetById(Guid id)
    {
        var item = await _uow.Educations.GetByIdAsync(id);
        if (item == null) return NotFound(ApiResponse<EducationDto>.Fail("Not found."));
        return Ok(ApiResponse<EducationDto>.Ok(_mapper.Map<EducationDto>(item)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<EducationDto>>> Create([FromBody] CreateEducationRequest request)
    {
        var entity = _mapper.Map<Education>(request);
        await _uow.Educations.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, ApiResponse<EducationDto>.Ok(_mapper.Map<EducationDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> Update(Guid id, [FromBody] UpdateEducationRequest request)
    {
        var entity = await _uow.Educations.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<EducationDto>.Fail("Not found."));
        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Educations.UpdateAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<EducationDto>.Ok(_mapper.Map<EducationDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Educations.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Educations.DeleteAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
