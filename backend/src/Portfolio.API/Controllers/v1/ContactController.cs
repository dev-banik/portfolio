using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ContactController(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<bool>>> Send([FromBody] SendContactMessageRequest request)
    {
        var entity = _mapper.Map<ContactMessage>(request);
        entity.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        await _uow.ContactMessages.AddAsync(entity);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Message sent successfully! I'll get back to you soon."));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ContactMessageDto>>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] bool? unread = null)
    {
        var query = _uow.ContactMessages.Query().Where(m => m.IsActive);
        if (unread == true) query = query.Where(m => !m.IsRead);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(ApiResponse<PagedResult<ContactMessageDto>>.Ok(new PagedResult<ContactMessageDto>
        {
            Data = _mapper.Map<IEnumerable<ContactMessageDto>>(items),
            TotalCount = total, Page = page, PageSize = pageSize
        }));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ContactMessageDto>>> GetById(Guid id)
    {
        var item = await _uow.ContactMessages.GetByIdAsync(id);
        if (item == null) return NotFound(ApiResponse<ContactMessageDto>.Fail("Not found."));
        if (!item.IsRead) { item.IsRead = true; item.UpdatedAt = DateTime.UtcNow; await _uow.ContactMessages.UpdateAsync(item); await _uow.SaveChangesAsync(); }
        return Ok(ApiResponse<ContactMessageDto>.Ok(_mapper.Map<ContactMessageDto>(item)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.ContactMessages.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.ContactMessages.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
