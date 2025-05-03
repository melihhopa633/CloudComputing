using MediatR;

namespace ResourceManagerService.Features.Task.GetAllTask
{
    public record GetAllTaskQuery : IRequest<List<Entities.Task>>;
} 