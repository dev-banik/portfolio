using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly IFileUploadService _fileUpload;

    public UploadController(IFileUploadService fileUpload) => _fileUpload = fileUpload;

    [HttpPost]
    public async Task<ActionResult<ApiResponse<string>>> Upload(IFormFile file, [FromQuery] string folder = "general")
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<string>.Fail("No file provided."));

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(ApiResponse<string>.Fail("File type not allowed."));

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(ApiResponse<string>.Fail("File size must be less than 10MB."));

        using var stream = file.OpenReadStream();
        var url = await _fileUpload.UploadAsync(stream, file.FileName, folder);
        return Ok(ApiResponse<string>.Ok(url, "File uploaded successfully."));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<string>>>> GetFiles([FromQuery] string folder = "general")
    {
        var files = await _fileUpload.GetFilesAsync(folder);
        return Ok(ApiResponse<IEnumerable<string>>.Ok(files));
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<bool>>> Delete([FromQuery] string fileUrl)
    {
        var result = await _fileUpload.DeleteAsync(fileUrl);
        return Ok(ApiResponse<bool>.Ok(result));
    }
}
