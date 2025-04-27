using System.Threading;
using System.Threading.Tasks;
using FileStorageService.Entities;
using FileStorageService.Storage;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace FileStorageService.Features.UploadFile
{
    public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, FileRecord>
    {
        private readonly IFileStorageService _fileStorageService;
        public UploadFileCommandHandler(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<FileRecord> Handle(UploadFileCommand request, CancellationToken cancellationToken)
        {
            var objectName = await _fileStorageService.UploadFileAsync(request.File, request.BucketName);
            return new FileRecord
            {
                Id = Guid.NewGuid(),
                FileName = request.File.FileName,
                BucketName = request.BucketName,
                ObjectName = objectName,
                UploadedAt = DateTime.UtcNow
            };
        }
    }
}
