using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Service : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public string? Price { get; set; }
    public string? Features { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}
