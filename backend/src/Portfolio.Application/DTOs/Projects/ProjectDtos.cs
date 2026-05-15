namespace Portfolio.Application.DTOs.Projects;

public class ProjectCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProjectCount { get; set; }
}

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public string? LiveUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? TechStack { get; set; }
    public List<string> TechStackList => TechStack?.Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(t => t.Trim()).ToList() ?? new();
    public bool IsFeatured { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int DisplayOrder { get; set; }
    public int ViewCount { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public bool IsActive { get; set; }
}

public class CreateProjectRequest
{
    public string Title { get; set; } = string.Empty;
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
    public Guid? CategoryId { get; set; }
}

public class UpdateProjectRequest : CreateProjectRequest
{
    public bool IsActive { get; set; } = true;
}

public class CreateProjectCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateProjectCategoryRequest : CreateProjectCategoryRequest
{
    public bool IsActive { get; set; } = true;
}
