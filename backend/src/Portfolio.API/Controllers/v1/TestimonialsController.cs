using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Testimonials;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public TestimonialsController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestimonialDto>>>> GetAll([FromQuery] bool? featured = null)
    {
        var query = _uow.Testimonials.Query().Where(t => t.IsActive);
        if (featured.HasValue) query = query.Where(t => t.IsFeatured == featured.Value);
        var items = await query.OrderBy(t => t.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<TestimonialDto>>.Ok(_mapper.Map<IEnumerable<TestimonialDto>>(items)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> Create([FromBody] CreateTestimonialRequest request)
    {
        var entity = _mapper.Map<Testimonial>(request);
        await _uow.Testimonials.AddAsync(entity); await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), ApiResponse<TestimonialDto>.Ok(_mapper.Map<TestimonialDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> Update(Guid id, [FromBody] UpdateTestimonialRequest request)
    {
        var entity = await _uow.Testimonials.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<TestimonialDto>.Fail("Not found."));
        _mapper.Map(request, entity); entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Testimonials.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<TestimonialDto>.Ok(_mapper.Map<TestimonialDto>(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Testimonials.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Testimonials.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
