using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class SkillCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public ICollection<Skill> Skills { get; set; } = new List<Skill>();
}
