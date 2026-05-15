using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Section : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
    public string? BackgroundType { get; set; } = "default";
    public string? CustomCss { get; set; }
}
