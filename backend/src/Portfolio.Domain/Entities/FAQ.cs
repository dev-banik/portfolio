using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class FAQ : BaseEntity
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}
