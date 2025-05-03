using MediatR;
using System;
using ResourceManagerService.Entities;

namespace ResourceManagerService.Features.Task
{
    public record GetTaskQuery(Guid Id) : IRequest<Entities.Task>;
} 