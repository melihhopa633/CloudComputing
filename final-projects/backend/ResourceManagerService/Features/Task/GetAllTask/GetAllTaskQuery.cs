using MediatR;
using System;

namespace ResourceManagerService.Features.Task.GetAllTask
{
    public record GetAllTaskQuery(
        string? Status = null,
        string? ServiceType = null,
        Guid? UserId = null,
        string? OrderBy = null,
        string? Order = null
    ) : IRequest<List<Entities.Task>>;
} 