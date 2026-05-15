using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Achievement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? MetricValue { get; set; }
    public string? MetricLabel { get; set; }
    public DateTime? AchievedDate { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}
