using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class VisitorAnalytics : BaseEntity
{
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Page { get; set; }
    public string? Referrer { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
    public int SessionDurationSeconds { get; set; }
}
