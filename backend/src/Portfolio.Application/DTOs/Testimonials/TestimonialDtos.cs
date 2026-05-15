namespace Portfolio.Application.DTOs.Testimonials;

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientRole { get; set; } = string.Empty;
    public string ClientCompany { get; set; } = string.Empty;
    public string? ClientAvatarUrl { get; set; }
    public string? ClientLinkedinUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
}

public class CreateTestimonialRequest
{
    public string ClientName { get; set; } = string.Empty;
    public string ClientRole { get; set; } = string.Empty;
    public string ClientCompany { get; set; } = string.Empty;
    public string? ClientAvatarUrl { get; set; }
    public string? ClientLinkedinUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
}

public class UpdateTestimonialRequest : CreateTestimonialRequest
{
    public bool IsActive { get; set; } = true;
}
