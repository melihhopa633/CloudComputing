using MediatR;

namespace ResourceManagerService.Features.Task.GetTask
{
    public record GetTaskQuery(Guid Id) : IRequest<Entities.Task>;
} 