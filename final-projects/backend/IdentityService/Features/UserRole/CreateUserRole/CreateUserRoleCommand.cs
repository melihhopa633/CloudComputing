using System;
using MediatR;

namespace IdentityService.Features.UserRole.CreateUserRole
{
    public class CreateUserRoleCommand : IRequest<Guid>
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}
