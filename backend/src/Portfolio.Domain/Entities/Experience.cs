using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Experience : BaseEntity
{
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? CompanyLogoUrl { get; set; }
    public string? CompanyUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = "Full-time";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? TechStack { get; set; }
    public int DisplayOrder { get; set; }
}
