namespace Portfolio.Application.DTOs.Experience;

public class ExperienceDto
{
    public Guid Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? CompanyLogoUrl { get; set; }
    public string? CompanyUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? TechStack { get; set; }
    public List<string> TechStackList => TechStack?.Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(t => t.Trim()).ToList() ?? new();
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateExperienceRequest
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

public class UpdateExperienceRequest : CreateExperienceRequest
{
    public bool IsActive { get; set; } = true;
}
