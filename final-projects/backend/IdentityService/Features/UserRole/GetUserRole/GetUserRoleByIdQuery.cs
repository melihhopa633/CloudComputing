using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.UserRole.GetUserRole
{
    public record GetUserRoleByIdQuery(Guid Id) : IRequest<IdentityService.Entities.UserRole?>;

    public class GetUserRoleByIdQueryHandler : IRequestHandler<GetUserRoleByIdQuery, IdentityService.Entities.UserRole?>
    {
        private readonly AppDbContext _dbContext;
        public GetUserRoleByIdQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IdentityService.Entities.UserRole?> Handle(GetUserRoleByIdQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.Id == request.Id, cancellationToken);
        }
    }
}
