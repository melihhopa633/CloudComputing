using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.Role.UpdateRole
{
    public record UpdateRoleCommand(Guid Id, string RoleName) : IRequest<bool>;

    public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public UpdateRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
            if (role == null) return false;
            role.RoleName = request.RoleName;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
