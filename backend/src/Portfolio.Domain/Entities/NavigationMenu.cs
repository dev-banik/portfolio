using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class NavigationMenu : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsExternal { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
    public Guid? ParentId { get; set; }
    public NavigationMenu? Parent { get; set; }
    public ICollection<NavigationMenu> Children { get; set; } = new List<NavigationMenu>();
}
