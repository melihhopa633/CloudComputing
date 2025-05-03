using MediatR;
using System;
using System.Collections.Generic;
using ResourceManagerService.Entities;

namespace ResourceManagerService.Features.Task.GetAllTask
{
    public record GetAllTaskByUserIdQuery(Guid UserId) : IRequest<List<Entities.Task>>;
} 