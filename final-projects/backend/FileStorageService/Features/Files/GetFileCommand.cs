using MediatR;
using FileStorageService.Entities;

namespace FileStorageService.Features.Files
{
    public class GetFileCommand : IRequest<FileRecord?>
    {
        public Guid Id { get; set; }
        public GetFileCommand(Guid id)
        {
            Id = id;
        }
    }
}
