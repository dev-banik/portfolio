namespace Portfolio.Application.DTOs.Education;

public class EducationDto
{
    public Guid Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string FieldOfStudy { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string? InstitutionLogoUrl { get; set; }
    public string? InstitutionUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public double? Cgpa { get; set; }
    public string? MaxCgpa { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public string? Activities { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateEducationRequest
{
    public string Degree { get; set; } = string.Empty;
    public string FieldOfStudy { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string? InstitutionLogoUrl { get; set; }
    public string? InstitutionUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public double? Cgpa { get; set; }
    public string? MaxCgpa { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public string? Activities { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateEducationRequest : CreateEducationRequest
{
    public bool IsActive { get; set; } = true;
}
