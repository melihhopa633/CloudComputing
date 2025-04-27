using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.UserRole.UpdateUserRole
{
    public record UpdateUserRoleCommand(Guid Id, Guid UserId, Guid RoleId) : IRequest<bool>;

    public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public UpdateUserRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
        {
            var userRole = await _dbContext.UserRoles.FirstOrDefaultAsync(ur => ur.Id == request.Id, cancellationToken);
            if (userRole == null) return false;

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);
            if (user == null || role == null) return false;

            userRole.UserId = request.UserId;
            userRole.RoleId = request.RoleId;
            userRole.User = user;
            userRole.Role = role;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
