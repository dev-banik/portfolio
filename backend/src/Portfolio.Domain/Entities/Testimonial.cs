using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Testimonial : BaseEntity
{
    public string ClientName { get; set; } = string.Empty;
    public string ClientRole { get; set; } = string.Empty;
    public string ClientCompany { get; set; } = string.Empty;
    public string? ClientAvatarUrl { get; set; }
    public string? ClientLinkedinUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}
