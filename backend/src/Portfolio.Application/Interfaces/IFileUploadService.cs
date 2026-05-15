namespace Portfolio.Application.Interfaces;

public interface IFileUploadService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string folder = "general");
    Task<bool> DeleteAsync(string fileUrl);
    Task<IEnumerable<string>> GetFilesAsync(string folder);
}
