using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.UserRole.GetAllUserRole
{
    public record GetAllUserRoleQuery() : IRequest<List<IdentityService.Entities.UserRole>>;

    public class GetAllUserRoleQueryHandler : IRequestHandler<GetAllUserRoleQuery, List<IdentityService.Entities.UserRole>>
    {
        private readonly AppDbContext _dbContext;
        public GetAllUserRoleQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<IdentityService.Entities.UserRole>> Handle(GetAllUserRoleQuery request, CancellationToken cancellationToken)
        {
            var userRoles = await _dbContext.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .ToListAsync(cancellationToken);
            return userRoles;
        }
    }
}
