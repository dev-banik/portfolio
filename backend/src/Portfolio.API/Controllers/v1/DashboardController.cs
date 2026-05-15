using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;

namespace Portfolio.API.Controllers.v1;

public class DashboardStats
{
    public int TotalProjects { get; set; }
    public int TotalBlogs { get; set; }
    public int TotalMessages { get; set; }
    public int UnreadMessages { get; set; }
    public int TotalSkills { get; set; }
    public int TotalCertifications { get; set; }
    public int TotalTestimonials { get; set; }
    public int TotalVisitors { get; set; }
    public List<MonthlyVisit> MonthlyVisits { get; set; } = new();
}

public class MonthlyVisit
{
    public string Month { get; set; } = string.Empty;
    public int Count { get; set; }
}

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public DashboardController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<DashboardStats>>> GetStats()
    {
        var stats = new DashboardStats
        {
            TotalProjects = await _uow.Projects.CountAsync(p => p.IsActive),
            TotalBlogs = await _uow.Blogs.CountAsync(b => b.IsActive && b.IsPublished),
            TotalMessages = await _uow.ContactMessages.CountAsync(m => m.IsActive),
            UnreadMessages = await _uow.ContactMessages.CountAsync(m => m.IsActive && !m.IsRead),
            TotalSkills = await _uow.Skills.CountAsync(s => s.IsActive),
            TotalCertifications = await _uow.Certifications.CountAsync(c => c.IsActive),
            TotalTestimonials = await _uow.Testimonials.CountAsync(t => t.IsActive),
            TotalVisitors = await _uow.VisitorAnalytics.CountAsync()
        };

        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        var visits = await _uow.VisitorAnalytics.Query()
            .Where(v => v.VisitedAt >= sixMonthsAgo)
            .GroupBy(v => new { v.VisitedAt.Year, v.VisitedAt.Month })
            .Select(g => new MonthlyVisit
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Count = g.Count()
            })
            .OrderBy(v => v.Month)
            .ToListAsync();

        stats.MonthlyVisits = visits;
        return Ok(ApiResponse<DashboardStats>.Ok(stats));
    }
}
