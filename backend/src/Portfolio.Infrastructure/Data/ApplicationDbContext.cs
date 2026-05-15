using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Domain.Entities.Profile> Profiles { get; set; }
    public DbSet<SkillCategory> SkillCategories { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<ProjectCategory> ProjectCategories { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<BlogCategory> BlogCategories { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<Testimonial> Testimonials { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<NavigationMenu> NavigationMenus { get; set; }
    public DbSet<SocialLink> SocialLinks { get; set; }
    public DbSet<SiteConfig> SiteConfigs { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Domain.Entities.Service> Services { get; set; }
    public DbSet<FAQ> FAQs { get; set; }
    public DbSet<VisitorAnalytics> VisitorAnalytics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256);
        });

        modelBuilder.Entity<Domain.Entities.Profile>(e =>
        {
            e.Property(p => p.Email).HasMaxLength(256);
        });

        modelBuilder.Entity<Skill>(e =>
        {
            e.HasOne(s => s.Category)
                .WithMany(c => c.Skills)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Project>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasOne(p => p.Category)
                .WithMany(c => c.Projects)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Blog>(e =>
        {
            e.HasIndex(b => b.Slug).IsUnique();
            e.HasOne(b => b.Category)
                .WithMany(c => c.Blogs)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Comment>(e =>
        {
            e.HasOne(c => c.Blog)
                .WithMany(b => b.Comments)
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Parent)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<NavigationMenu>(e =>
        {
            e.HasOne(n => n.Parent)
                .WithMany(n => n.Children)
                .HasForeignKey(n => n.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SiteConfig>(e =>
        {
            e.HasIndex(s => s.Key).IsUnique();
        });

        // Seed admin user
        var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = adminId,
            Email = "admin@portfolio.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
            FirstName = "Parthib",
            LastName = "Banik",
            Role = "Admin",
            IsActive = true,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var profileId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        modelBuilder.Entity<Domain.Entities.Profile>().HasData(new Domain.Entities.Profile
        {
            Id = profileId,
            FullName = "Parthib Banik",
            Title = "Back-End Software Engineer",
            Tagline = "Building scalable backend systems with .NET Core & cloud-based architecture",
            Bio = "Backend Software Engineer with 2+ years of hands-on experience in .NET Core and cloud-based systems, specializing in designing, developing, and optimizing high-availability RESTful APIs using C#, ASP.NET Core, and SQL Server.",
            Email = "banikparthib401@gmail.com",
            Phone = "+880 1633 575072",
            Location = "Dhaka, Bangladesh",
            YearsOfExperience = 2,
            ProjectsCompleted = 10,
            HappyClients = 35,
            GithubUrl = "https://github.com",
            LinkedinUrl = "https://linkedin.com",
            GithubUsername = "parthibbanik",
            IsAvailableForHire = true,
            AvailabilityNote = "Open to full-time and contract opportunities",
            MetaTitle = "Parthib Banik - Backend Software Engineer",
            MetaDescription = "Backend Software Engineer specializing in .NET Core, C#, and scalable system design.",
            MetaKeywords = "backend, .net, csharp, software engineer, Dhaka, Bangladesh",
            IsActive = true,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        // Seed navigation
        var nav1 = Guid.Parse("00000000-0000-0000-0001-000000000001");
        var nav2 = Guid.Parse("00000000-0000-0000-0001-000000000002");
        var nav3 = Guid.Parse("00000000-0000-0000-0001-000000000003");
        var nav4 = Guid.Parse("00000000-0000-0000-0001-000000000004");
        var nav5 = Guid.Parse("00000000-0000-0000-0001-000000000005");
        var nav6 = Guid.Parse("00000000-0000-0000-0001-000000000006");
        modelBuilder.Entity<NavigationMenu>().HasData(
            new NavigationMenu { Id = nav1, Label = "Home", Href = "/", DisplayOrder = 1, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new NavigationMenu { Id = nav2, Label = "About", Href = "/#about", DisplayOrder = 2, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new NavigationMenu { Id = nav3, Label = "Skills", Href = "/#skills", DisplayOrder = 3, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new NavigationMenu { Id = nav4, Label = "Projects", Href = "/projects", DisplayOrder = 4, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new NavigationMenu { Id = nav5, Label = "Blog", Href = "/blog", DisplayOrder = 5, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new NavigationMenu { Id = nav6, Label = "Contact", Href = "/#contact", DisplayOrder = 6, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) }
        );

        // Seed social links
        modelBuilder.Entity<SocialLink>().HasData(
            new SocialLink { Id = Guid.NewGuid(), Platform = "GitHub", Url = "https://github.com", Icon = "github", Color = "#181717", DisplayOrder = 1, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new SocialLink { Id = Guid.NewGuid(), Platform = "LinkedIn", Url = "https://linkedin.com", Icon = "linkedin", Color = "#0A66C2", DisplayOrder = 2, IsVisible = true, IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) }
        );

        // Seed sections
        var sections = new[]
        {
            new { Key = "hero", Title = "Hero", Subtitle = (string?)null, Order = 1 },
            new { Key = "about", Title = "About Me", Subtitle = (string?)"Who I Am", Order = 2 },
            new { Key = "skills", Title = "My Skills", Subtitle = (string?)"Technical Expertise", Order = 3 },
            new { Key = "experience", Title = "Experience", Subtitle = (string?)"Professional Journey", Order = 4 },
            new { Key = "education", Title = "Education", Subtitle = (string?)"Academic Background", Order = 5 },
            new { Key = "projects", Title = "Projects", Subtitle = (string?)"What I've Built", Order = 6 },
            new { Key = "certifications", Title = "Certifications", Subtitle = (string?)"Credentials", Order = 7 },
            new { Key = "achievements", Title = "Achievements", Subtitle = (string?)"Key Milestones", Order = 8 },
            new { Key = "testimonials", Title = "Testimonials", Subtitle = (string?)"What People Say", Order = 9 },
            new { Key = "blog", Title = "Blog", Subtitle = (string?)"Articles & Insights", Order = 10 },
            new { Key = "contact", Title = "Contact", Subtitle = (string?)"Get In Touch", Order = 11 },
        };

        foreach (var s in sections)
        {
            modelBuilder.Entity<Section>().HasData(new Section
            {
                Id = Guid.NewGuid(),
                Key = s.Key,
                Title = s.Title,
                Subtitle = s.Subtitle,
                IsVisible = true,
                DisplayOrder = s.Order,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }

        // Seed site config
        modelBuilder.Entity<SiteConfig>().HasData(
            new SiteConfig { Id = Guid.NewGuid(), Key = "site_name", Value = "Parthib Banik Portfolio", Group = "General", DataType = "string", IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new SiteConfig { Id = Guid.NewGuid(), Key = "primary_color", Value = "#6366f1", Group = "Theme", DataType = "color", IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new SiteConfig { Id = Guid.NewGuid(), Key = "secondary_color", Value = "#8b5cf6", Group = "Theme", DataType = "color", IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new SiteConfig { Id = Guid.NewGuid(), Key = "footer_text", Value = "© 2025 Parthib Banik. All rights reserved.", Group = "General", DataType = "string", IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new SiteConfig { Id = Guid.NewGuid(), Key = "google_analytics_id", Value = "", Group = "Analytics", DataType = "string", IsActive = true, CreatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc), UpdatedAt = new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) }
        );
    }
}
