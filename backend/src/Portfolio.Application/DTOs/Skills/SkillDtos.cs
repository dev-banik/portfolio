namespace Portfolio.Application.DTOs.Skills;

public class SkillCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public IEnumerable<SkillDto> Skills { get; set; } = Enumerable.Empty<SkillDto>();
}

public class SkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Percentage { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

public class CreateSkillCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateSkillCategoryRequest : CreateSkillCategoryRequest
{
    public bool IsActive { get; set; } = true;
}

public class CreateSkillRequest
{
    public string Name { get; set; } = string.Empty;
    public int Percentage { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public Guid CategoryId { get; set; }
}

public class UpdateSkillRequest : CreateSkillRequest
{
    public bool IsActive { get; set; } = true;
}
