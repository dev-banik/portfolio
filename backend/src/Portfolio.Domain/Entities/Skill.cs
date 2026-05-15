using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Percentage { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public Guid CategoryId { get; set; }
    public SkillCategory Category { get; set; } = null!;
}
