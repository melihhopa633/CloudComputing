using MediatR;
using System;

namespace ResourceManagerService.Features.Task
{
    public record DeleteTaskCommand(Guid Id) : IRequest<bool>;
} 