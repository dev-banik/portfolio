using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Education : BaseEntity
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
