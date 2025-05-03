using MediatR;
using System.Collections.Generic;
using ResourceManagerService.Entities;

namespace ResourceManagerService.Features.Task
{
    public record GetAllTaskQuery : IRequest<List<Entities.Task>>;
} 