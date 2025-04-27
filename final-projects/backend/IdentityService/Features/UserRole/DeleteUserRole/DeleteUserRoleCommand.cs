using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;

namespace IdentityService.Features.UserRole.DeleteUserRole
{
    public record DeleteUserRoleCommand(Guid Id) : IRequest<bool>;

    public class DeleteUserRoleCommandHandler : IRequestHandler<DeleteUserRoleCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public DeleteUserRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(DeleteUserRoleCommand request, CancellationToken cancellationToken)
        {
            var userRole = await _dbContext.UserRoles.FirstOrDefaultAsync(ur => ur.Id == request.Id, cancellationToken);
            if (userRole == null) return false;
            _dbContext.UserRoles.Remove(userRole);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
