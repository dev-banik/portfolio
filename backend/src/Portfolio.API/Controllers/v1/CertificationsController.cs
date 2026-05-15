using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers.v1;

public class CertificationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? IssuerLogoUrl { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool DoesNotExpire { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCertificationRequest
{
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? IssuerLogoUrl { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool DoesNotExpire { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}

[ApiController]
[Route("api/v1/[controller]")]
public class CertificationsController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public CertificationsController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CertificationDto>>>> GetAll()
    {
        var items = await _uow.Certifications.Query()
            .Where(c => c.IsActive).OrderBy(c => c.DisplayOrder).ToListAsync();
        return Ok(ApiResponse<IEnumerable<CertificationDto>>.Ok(items.Select(MapToDto)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CertificationDto>>> Create([FromBody] CreateCertificationRequest req)
    {
        var entity = new Certification { Name = req.Name, Issuer = req.Issuer, IssuerLogoUrl = req.IssuerLogoUrl, CredentialId = req.CredentialId, CredentialUrl = req.CredentialUrl, ImageUrl = req.ImageUrl, IssuedDate = req.IssuedDate, ExpiryDate = req.ExpiryDate, DoesNotExpire = req.DoesNotExpire, DisplayOrder = req.DisplayOrder, IsFeatured = req.IsFeatured };
        await _uow.Certifications.AddAsync(entity); await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), ApiResponse<CertificationDto>.Ok(MapToDto(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CertificationDto>>> Update(Guid id, [FromBody] CreateCertificationRequest req)
    {
        var entity = await _uow.Certifications.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<CertificationDto>.Fail("Not found."));
        entity.Name = req.Name; entity.Issuer = req.Issuer; entity.IssuerLogoUrl = req.IssuerLogoUrl; entity.CredentialId = req.CredentialId; entity.CredentialUrl = req.CredentialUrl; entity.ImageUrl = req.ImageUrl; entity.IssuedDate = req.IssuedDate; entity.ExpiryDate = req.ExpiryDate; entity.DoesNotExpire = req.DoesNotExpire; entity.DisplayOrder = req.DisplayOrder; entity.IsFeatured = req.IsFeatured; entity.UpdatedAt = DateTime.UtcNow;
        await _uow.Certifications.UpdateAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<CertificationDto>.Ok(MapToDto(entity)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var entity = await _uow.Certifications.GetByIdAsync(id);
        if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found."));
        await _uow.Certifications.DeleteAsync(entity); await _uow.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    private static CertificationDto MapToDto(Certification c) => new() { Id = c.Id, Name = c.Name, Issuer = c.Issuer, IssuerLogoUrl = c.IssuerLogoUrl, CredentialId = c.CredentialId, CredentialUrl = c.CredentialUrl, ImageUrl = c.ImageUrl, IssuedDate = c.IssuedDate, ExpiryDate = c.ExpiryDate, DoesNotExpire = c.DoesNotExpire, DisplayOrder = c.DisplayOrder, IsFeatured = c.IsFeatured, IsActive = c.IsActive };
}
