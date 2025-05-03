using MediatR;
using System;

namespace ResourceManagerService.Features.Task
{
    public record CreateTaskCommand(Guid UserId, string ServiceType) : IRequest<Guid>;
} 