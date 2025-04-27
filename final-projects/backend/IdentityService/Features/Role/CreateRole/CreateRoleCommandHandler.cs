using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.Role.CreateRole
{
    public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Guid>
    {
        private readonly AppDbContext _dbContext;
        public CreateRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        {
            if (await _dbContext.Roles.AnyAsync(r => r.RoleName == request.RoleName, cancellationToken))
                throw new Exception("Role name already exists.");

            var role = new Entities.Role
            {
                Id = Guid.NewGuid(),
                RoleName = request.RoleName
            };
            _dbContext.Roles.Add(role);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return role.Id;
        }
    }
}
