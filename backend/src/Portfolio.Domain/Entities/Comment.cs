using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Comment : BaseEntity
{
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorEmail { get; set; } = string.Empty;
    public string? AuthorAvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public Guid BlogId { get; set; }
    public Blog Blog { get; set; } = null!;
    public Guid? ParentId { get; set; }
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}
