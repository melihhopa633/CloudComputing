using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;

namespace IdentityService.Features.Role.DeleteRole
{
    public record DeleteRoleCommand(Guid Id) : IRequest<bool>;

    public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public DeleteRoleCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
            if (role == null) return false;
            _dbContext.Roles.Remove(role);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
