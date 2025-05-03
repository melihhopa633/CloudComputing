using MediatR;

namespace ResourceManagerService.Features.Task.DeleteTask
{
    public record DeleteTaskCommand(Guid Id) : IRequest<bool>;
} 