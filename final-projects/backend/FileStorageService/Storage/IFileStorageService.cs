using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FileStorageService.Storage
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string bucketName);
        Task<Stream> DownloadFileAsync(string bucketName, string objectName);
        Task DeleteFileAsync(string bucketName, string objectName);
    }
}
