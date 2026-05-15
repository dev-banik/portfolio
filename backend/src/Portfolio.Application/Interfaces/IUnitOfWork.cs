using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<Domain.Entities.Profile> Profiles { get; }
    IGenericRepository<SkillCategory> SkillCategories { get; }
    IGenericRepository<Skill> Skills { get; }
    IGenericRepository<Experience> Experiences { get; }
    IGenericRepository<Education> Educations { get; }
    IGenericRepository<ProjectCategory> ProjectCategories { get; }
    IGenericRepository<Project> Projects { get; }
    IGenericRepository<BlogCategory> BlogCategories { get; }
    IGenericRepository<Blog> Blogs { get; }
    IGenericRepository<Comment> Comments { get; }
    IGenericRepository<Certification> Certifications { get; }
    IGenericRepository<Achievement> Achievements { get; }
    IGenericRepository<Testimonial> Testimonials { get; }
    IGenericRepository<ContactMessage> ContactMessages { get; }
    IGenericRepository<NavigationMenu> NavigationMenus { get; }
    IGenericRepository<SocialLink> SocialLinks { get; }
    IGenericRepository<SiteConfig> SiteConfigs { get; }
    IGenericRepository<Section> Sections { get; }
    IGenericRepository<Domain.Entities.Service> Services { get; }
    IGenericRepository<FAQ> FAQs { get; }
    IGenericRepository<VisitorAnalytics> VisitorAnalytics { get; }
    Task<int> SaveChangesAsync();
}
