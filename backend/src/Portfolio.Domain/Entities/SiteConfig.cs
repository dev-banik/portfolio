using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class SiteConfig : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Group { get; set; } = "General";
    public string DataType { get; set; } = "string";
}
