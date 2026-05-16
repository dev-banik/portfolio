using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

public class SiteConfigDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Group { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
}

public class SocialLinkDto
{
    public Guid Id { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; }
}

public class SectionDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public bool IsVisible { get; set; }
    public int DisplayOrder { get; set; }
}

[ApiController]
[Route("api/v1/site-config")]
public class SiteConfigController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public SiteConfigController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<SiteConfigDto>>>> GetAll()
    {
        var items = await _uow.SiteConfigs.Query().Where(s => s.IsActive).ToListAsync();
        return Ok(ApiResponse<IEnumerable<SiteConfigDto>>.Ok(items.Select(s => new SiteConfigDto { Id = s.Id, Key = s.Key, Value = s.Value, Description = s.Description, Group = s.Group, DataType = s.DataType })));
    }

    [HttpGet("public")]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> GetPublic()
    {
        var items = await _uow.SiteConfigs.Query().Where(s => s.IsActive).ToListAsync();
        return Ok(ApiResponse<Dictionary<string, string>>.Ok(items.ToDictionary(s => s.Key, s => s.Value)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{key}")]
    public async Task<ActionResult<ApiResponse<SiteConfigDto>>> Update(string key, [FromBody] string value)
    {
        var entity = await _uow.SiteConfigs.FirstOrDefaultAsync(s => s.Key == key);
        if (entity == null) return NotFound(ApiResponse<SiteConfigDto>.Fail("Config not found."));
        entity.Value = value; entity.UpdatedAt = DateTime.UtcNow;
        await _uow.SiteConfigs.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<SiteConfigDto>.Ok(new SiteConfigDto { Id = entity.Id, Key = entity.Key, Value = entity.Value, Description = entity.Description, Group = entity.Group, DataType = entity.DataType }));
    }

    // Social Links
    [HttpGet("social-links")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SocialLinkDto>>>> GetSocialLinks()
    {
        var items = await _uow.SocialLinks.Query().Where(s => s.IsActive && s.IsVisible).OrderBy(s => s.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<SocialLinkDto>>.Ok(items.Select(s => new SocialLinkDto { Id = s.Id, Platform = s.Platform, Url = s.Url, Icon = s.Icon, Color = s.Color, DisplayOrder = s.DisplayOrder, IsVisible = s.IsVisible })));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("social-links")]
    public async Task<ActionResult<ApiResponse<SocialLinkDto>>> CreateSocialLink([FromBody] SocialLinkDto req)
    {
        var entity = new SocialLink { Platform = req.Platform, Url = req.Url, Icon = req.Icon, Color = req.Color, DisplayOrder = req.DisplayOrder, IsVisible = req.IsVisible };
        await _uow.SocialLinks.AddAsync(entity); await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSocialLinks), ApiResponse<SocialLinkDto>.Ok(new SocialLinkDto { Id = entity.Id, Platform = entity.Platform, Url = entity.Url, Icon = entity.Icon, Color = entity.Color, DisplayOrder = entity.DisplayOrder, IsVisible = entity.IsVisible }));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("social-links/{id}")]
    public async Task<ActionResult<ApiResponse<SocialLinkDto>>> UpdateSocialLink(Guid id, [FromBody] SocialLinkDto req)
    {
        var entity = await _uow.SocialLinks.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<SocialLinkDto>.Fail("Not found."));
        entity.Platform = req.Platform; entity.Url = req.Url; entity.Icon = req.Icon; entity.Color = req.Color; entity.DisplayOrder = req.DisplayOrder; entity.IsVisible = req.IsVisible; entity.UpdatedAt = DateTime.UtcNow;
        await _uow.SocialLinks.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<SocialLinkDto>.Ok(req));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("social-links/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSocialLink(Guid id)
    {
        var entity = await _uow.SocialLinks.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.SocialLinks.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    // Sections
    [HttpGet("sections")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SectionDto>>>> GetSections()
    {
        var items = await _uow.Sections.Query().Where(s => s.IsActive).OrderBy(s => s.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<SectionDto>>.Ok(items.Select(s => new SectionDto { Id = s.Id, Key = s.Key, Title = s.Title, Subtitle = s.Subtitle, Description = s.Description, IsVisible = s.IsVisible, DisplayOrder = s.DisplayOrder })));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("sections/{id}")]
    public async Task<ActionResult<ApiResponse<SectionDto>>> UpdateSection(Guid id, [FromBody] SectionDto req)
    {
        var entity = await _uow.Sections.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<SectionDto>.Fail("Not found."));
        entity.Title = req.Title; entity.Subtitle = req.Subtitle; entity.Description = req.Description; entity.IsVisible = req.IsVisible; entity.DisplayOrder = req.DisplayOrder; entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Sections.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<SectionDto>.Ok(req));
    }
}
