using MediatR;

namespace ResourceManagerService.Features.Task.CreateTask
{
    public class CreateTaskCommand : IRequest<CreateTaskResponse>
    {
        public Guid UserId { get; set; }
        public string ServiceType { get; set; }
        public string ContainerId { get; set; } = string.Empty;
    }
} 