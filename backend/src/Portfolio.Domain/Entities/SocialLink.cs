using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class SocialLink : BaseEntity
{
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
