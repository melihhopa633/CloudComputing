using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel;

namespace FileStorageService.Storage
{
    public class MinioFileStorageService : IFileStorageService
    {
        private readonly MinioClient _minioClient;
        public MinioFileStorageService(MinioClient minioClient)
        {
            _minioClient = minioClient;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName)
        {
            var objectName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            await using var stream = file.OpenReadStream();
            await _minioClient.PutObjectAsync(new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType));
            return objectName;
        }

        public async Task<Stream> DownloadFileAsync(string bucketName, string objectName)
        {
            var ms = new MemoryStream();
            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithCallbackStream(stream => stream.CopyTo(ms)));
            ms.Position = 0;
            return ms;
        }

        public async Task DeleteFileAsync(string bucketName, string objectName)
        {
            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName));
        }
    }
}
