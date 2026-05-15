using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class ProjectCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public ICollection<Project> Projects { get; set; } = new List<Project>();
}
