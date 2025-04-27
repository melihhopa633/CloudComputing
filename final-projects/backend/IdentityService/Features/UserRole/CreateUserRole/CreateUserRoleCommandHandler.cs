using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;
using IdentityService.Features.UserRole.CreateUserRole;

namespace IdentityService.Features.UserRole.CreateUserRole
{
    public class CreateUserRoleCommandHandler : IRequestHandler<CreateUserRoleCommand, Guid>
    {
        private readonly AppDbContext _dbContext;
        public CreateUserRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> Handle(CreateUserRoleCommand request, CancellationToken cancellationToken)
        {
            // Check if user and role exist
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);
            if (user == null || role == null)
                throw new Exception("User or Role not found.");

            // Prevent duplicate assignment
            var exists = await _dbContext.UserRoles.AnyAsync(ur => ur.UserId == request.UserId && ur.RoleId == request.RoleId, cancellationToken);
            if (exists)
                throw new Exception("User already has this role.");

            var userRole = new IdentityService.Entities.UserRole
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                RoleId = request.RoleId,
                User = user,
                Role = role
            };
            _dbContext.UserRoles.Add(userRole);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return userRole.Id;
        }
    }
}
