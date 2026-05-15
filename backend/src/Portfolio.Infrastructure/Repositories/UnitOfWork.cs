using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Users = new GenericRepository<User>(context);
        Profiles = new GenericRepository<Domain.Entities.Profile>(context);
        SkillCategories = new GenericRepository<SkillCategory>(context);
        Skills = new GenericRepository<Skill>(context);
        Experiences = new GenericRepository<Experience>(context);
        Educations = new GenericRepository<Education>(context);
        ProjectCategories = new GenericRepository<ProjectCategory>(context);
        Projects = new GenericRepository<Project>(context);
        BlogCategories = new GenericRepository<BlogCategory>(context);
        Blogs = new GenericRepository<Blog>(context);
        Comments = new GenericRepository<Comment>(context);
        Certifications = new GenericRepository<Certification>(context);
        Achievements = new GenericRepository<Achievement>(context);
        Testimonials = new GenericRepository<Testimonial>(context);
        ContactMessages = new GenericRepository<ContactMessage>(context);
        NavigationMenus = new GenericRepository<NavigationMenu>(context);
        SocialLinks = new GenericRepository<SocialLink>(context);
        SiteConfigs = new GenericRepository<SiteConfig>(context);
        Sections = new GenericRepository<Section>(context);
        Services = new GenericRepository<Domain.Entities.Service>(context);
        FAQs = new GenericRepository<FAQ>(context);
        VisitorAnalytics = new GenericRepository<VisitorAnalytics>(context);
    }

    public IGenericRepository<User> Users { get; }
    public IGenericRepository<Domain.Entities.Profile> Profiles { get; }
    public IGenericRepository<SkillCategory> SkillCategories { get; }
    public IGenericRepository<Skill> Skills { get; }
    public IGenericRepository<Experience> Experiences { get; }
    public IGenericRepository<Education> Educations { get; }
    public IGenericRepository<ProjectCategory> ProjectCategories { get; }
    public IGenericRepository<Project> Projects { get; }
    public IGenericRepository<BlogCategory> BlogCategories { get; }
    public IGenericRepository<Blog> Blogs { get; }
    public IGenericRepository<Comment> Comments { get; }
    public IGenericRepository<Certification> Certifications { get; }
    public IGenericRepository<Achievement> Achievements { get; }
    public IGenericRepository<Testimonial> Testimonials { get; }
    public IGenericRepository<ContactMessage> ContactMessages { get; }
    public IGenericRepository<NavigationMenu> NavigationMenus { get; }
    public IGenericRepository<SocialLink> SocialLinks { get; }
    public IGenericRepository<SiteConfig> SiteConfigs { get; }
    public IGenericRepository<Section> Sections { get; }
    public IGenericRepository<Domain.Entities.Service> Services { get; }
    public IGenericRepository<FAQ> FAQs { get; }
    public IGenericRepository<VisitorAnalytics> VisitorAnalytics { get; }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
