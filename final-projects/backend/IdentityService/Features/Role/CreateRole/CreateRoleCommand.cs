using MediatR;
using System;

namespace IdentityService.Features.Role.CreateRole
{
    public record CreateRoleCommand(string RoleName) : IRequest<Guid>;
}
