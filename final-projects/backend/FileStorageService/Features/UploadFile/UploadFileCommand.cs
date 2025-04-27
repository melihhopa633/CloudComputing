using Microsoft.AspNetCore.Http;

namespace FileStorageService.Features.UploadFile
{
    public class UploadFileCommand
    {
        public IFormFile File { get; set; }
        public string BucketName { get; set; }
    }
}
