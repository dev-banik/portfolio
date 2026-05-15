using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

public class NavigationMenuDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsExternal { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; }
    public Guid? ParentId { get; set; }
    public List<NavigationMenuDto> Children { get; set; } = new();
}

public class CreateNavMenuRequest
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsExternal { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
    public Guid? ParentId { get; set; }
}

[ApiController]
[Route("api/v1/[controller]")]
public class NavigationController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public NavigationController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<NavigationMenuDto>>>> GetAll()
    {
        var items = await _uow.NavigationMenus.Query()
            .Where(n => n.IsActive && n.IsVisible && n.ParentId == null)
            .Include(n => n.Children.Where(c => c.IsActive && c.IsVisible))
            .OrderBy(n => n.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<NavigationMenuDto>>.Ok(items.Select(MapToDto)));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<ActionResult<ApiResponse<IEnumerable<NavigationMenuDto>>>> GetAllAdmin()
    {
        var items = await _uow.NavigationMenus.Query()
            .Where(n => n.IsActive && n.ParentId == null)
            .Include(n => n.Children)
            .OrderBy(n => n.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<NavigationMenuDto>>.Ok(items.Select(MapToDto)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<NavigationMenuDto>>> Create([FromBody] CreateNavMenuRequest req)
    {
        var entity = new NavigationMenu { Label = req.Label, Href = req.Href, Icon = req.Icon, IsExternal = req.IsExternal, DisplayOrder = req.DisplayOrder, IsVisible = req.IsVisible, ParentId = req.ParentId };
        await _uow.NavigationMenus.AddAsync(entity); await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), ApiResponse<NavigationMenuDto>.Ok(MapToDto(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<NavigationMenuDto>>> Update(Guid id, [FromBody] CreateNavMenuRequest req)
    {
        var entity = await _uow.NavigationMenus.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<NavigationMenuDto>.Fail("Not found."));
        entity.Label = req.Label; entity.Href = req.Href; entity.Icon = req.Icon; entity.IsExternal = req.IsExternal; entity.DisplayOrder = req.DisplayOrder; entity.IsVisible = req.IsVisible; entity.ParentId = req.ParentId; entity.UpdatedAt = DateTime.UtcNow;
        await _uow.NavigationMenus.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<NavigationMenuDto>.Ok(MapToDto(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.NavigationMenus.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.NavigationMenus.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    private static NavigationMenuDto MapToDto(NavigationMenu n) => new()
    {
        Id = n.Id, Label = n.Label, Href = n.Href, Icon = n.Icon, IsExternal = n.IsExternal,
        DisplayOrder = n.DisplayOrder, IsVisible = n.IsVisible, ParentId = n.ParentId,
        Children = n.Children.OrderBy(c => c.DisplayOrder).Select(MapToDto).ToList()
    };
}
