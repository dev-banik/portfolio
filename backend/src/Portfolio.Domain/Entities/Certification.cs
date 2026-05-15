using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Certification : BaseEntity
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
