using Microsoft.Extensions.Configuration;
using Portfolio.Application.Interfaces;

namespace Portfolio.Infrastructure.Services;

public class LocalFileUploadService : IFileUploadService
{
    private readonly string _uploadRoot;

    public LocalFileUploadService(IConfiguration configuration)
    {
        _uploadRoot = configuration["UploadPath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string folder = "general")
    {
        var uploadPath = Path.Combine(_uploadRoot, folder);
        Directory.CreateDirectory(uploadPath);

        var ext = Path.GetExtension(fileName);
        var uniqueName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadPath, uniqueName);

        using var fs = new FileStream(filePath, FileMode.Create);
        await fileStream.CopyToAsync(fs);

        return $"/uploads/{folder}/{uniqueName}";
    }

    public async Task<bool> DeleteAsync(string fileUrl)
    {
        var relativePath = fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }
        return await Task.FromResult(false);
    }

    public async Task<IEnumerable<string>> GetFilesAsync(string folder)
    {
        var uploadPath = Path.Combine(_uploadRoot, folder);
        if (!Directory.Exists(uploadPath)) return Enumerable.Empty<string>();
        return await Task.FromResult(Directory.GetFiles(uploadPath)
            .Select(f => $"/uploads/{folder}/{Path.GetFileName(f)}"));
    }
}
