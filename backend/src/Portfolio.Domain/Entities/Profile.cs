using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Profile : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public int YearsOfExperience { get; set; }
    public int ProjectsCompleted { get; set; }
    public int HappyClients { get; set; }
    public string? GithubUrl { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? CodeforcesUrl { get; set; }
    public string? LeetcodeUrl { get; set; }
    public string? GithubUsername { get; set; }
    public bool IsAvailableForHire { get; set; } = true;
    public string? AvailabilityNote { get; set; }
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public string? MetaKeywords { get; set; }
    public string? OgImageUrl { get; set; }
}
