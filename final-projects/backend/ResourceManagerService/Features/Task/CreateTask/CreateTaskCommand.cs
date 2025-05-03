using MediatR;
using System;

namespace ResourceManagerService.Features.Task
{
    public class CreateTaskCommand : IRequest<Guid>
    {
        public Guid UserId { get; set; }
        public string ServiceType { get; set; }
        public string ContainerId { get; set; } = string.Empty;
        public int Port { get; set; }
    }
} 