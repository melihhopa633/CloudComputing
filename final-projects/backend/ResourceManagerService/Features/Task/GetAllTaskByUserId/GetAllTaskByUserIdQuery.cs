using MediatR;

namespace ResourceManagerService.Features.Task.GetAllTaskByUserId
{
    public record GetAllTaskByUserIdQuery(Guid UserId) : IRequest<List<Entities.Task>>;
} 