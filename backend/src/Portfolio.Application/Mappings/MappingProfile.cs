using AutoMapper;
using Portfolio.Application.DTOs.Auth;
using Portfolio.Application.DTOs.Blog;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.DTOs.Education;
using Portfolio.Application.DTOs.Experience;
using Portfolio.Application.DTOs.Profile;
using Portfolio.Application.DTOs.Projects;
using Portfolio.Application.DTOs.Skills;
using Portfolio.Application.DTOs.Testimonials;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Mappings;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        // Auth
        CreateMap<User, UserDto>();

        // Profile
        CreateMap<Domain.Entities.Profile, ProfileDto>();
        CreateMap<UpdateProfileRequest, Domain.Entities.Profile>();

        // Skills
        CreateMap<SkillCategory, SkillCategoryDto>()
            .ForMember(d => d.Skills, o => o.MapFrom(s => s.Skills));
        CreateMap<CreateSkillCategoryRequest, SkillCategory>();
        CreateMap<UpdateSkillCategoryRequest, SkillCategory>();

        CreateMap<Skill, SkillDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name));
        CreateMap<CreateSkillRequest, Skill>();
        CreateMap<UpdateSkillRequest, Skill>();

        // Experience
        CreateMap<Experience, ExperienceDto>();
        CreateMap<CreateExperienceRequest, Experience>();
        CreateMap<UpdateExperienceRequest, Experience>();

        // Education
        CreateMap<Education, EducationDto>();
        CreateMap<CreateEducationRequest, Education>();
        CreateMap<UpdateEducationRequest, Education>();

        // Projects
        CreateMap<ProjectCategory, ProjectCategoryDto>()
            .ForMember(d => d.ProjectCount, o => o.MapFrom(s => s.Projects.Count(p => p.IsActive)));
        CreateMap<CreateProjectCategoryRequest, ProjectCategory>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Name.ToLower().Replace(" ", "-")));
        CreateMap<UpdateProjectCategoryRequest, ProjectCategory>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Name.ToLower().Replace(" ", "-")));

        CreateMap<Project, ProjectDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.ImageUrls, o => o.MapFrom(s =>
                s.Images != null ? s.Images.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()));
        CreateMap<CreateProjectRequest, Project>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Title.ToLower().Replace(" ", "-")));
        CreateMap<UpdateProjectRequest, Project>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Title.ToLower().Replace(" ", "-")));

        // Blog
        CreateMap<BlogCategory, BlogCategoryDto>()
            .ForMember(d => d.BlogCount, o => o.MapFrom(s => s.Blogs.Count(b => b.IsActive && b.IsPublished)));
        CreateMap<Blog, BlogDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.Tags, o => o.MapFrom(s =>
                s.Tags != null ? s.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList() : new List<string>()));
        CreateMap<Blog, BlogListDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.Tags, o => o.MapFrom(s =>
                s.Tags != null ? s.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList() : new List<string>()));
        CreateMap<CreateBlogRequest, Blog>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Title.ToLower().Replace(" ", "-")));
        CreateMap<UpdateBlogRequest, Blog>()
            .ForMember(d => d.Slug, o => o.MapFrom(s => s.Title.ToLower().Replace(" ", "-")));

        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.Replies, o => o.MapFrom(s => s.Replies.Where(r => r.IsApproved)));
        CreateMap<CreateCommentRequest, Comment>();

        // Contact
        CreateMap<ContactMessage, ContactMessageDto>();
        CreateMap<SendContactMessageRequest, ContactMessage>();

        // Testimonials
        CreateMap<Testimonial, TestimonialDto>();
        CreateMap<CreateTestimonialRequest, Testimonial>();
        CreateMap<UpdateTestimonialRequest, Testimonial>();
    }
}
