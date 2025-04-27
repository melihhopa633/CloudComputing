using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.Role.GetRole
{
    public record GetRoleByIdQuery(Guid Id) : IRequest<Entities.Role?>;

    public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, Entities.Role?>
    {
        private readonly AppDbContext _dbContext;
        public GetRoleByIdQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Entities.Role?> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.Roles.Include(r => r.UserRoles).FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
        }
    }
}
