using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Project : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Images { get; set; }
    public string? LiveUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? TechStack { get; set; }
    public bool IsFeatured { get; set; }
    public string Status { get; set; } = "Completed";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int DisplayOrder { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public Guid? CategoryId { get; set; }
    public ProjectCategory? Category { get; set; }
}
