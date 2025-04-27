using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.Role.GetAllRole
{
    public record GetAllRoleQuery() : IRequest<List<Entities.Role>>;

    public class GetAllRoleQueryHandler : IRequestHandler<GetAllRoleQuery, List<Entities.Role>>
    {
        private readonly AppDbContext _dbContext;
        public GetAllRoleQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Entities.Role>> Handle(GetAllRoleQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.Roles.Include(r => r.UserRoles).ToListAsync(cancellationToken);
        }
    }
}
