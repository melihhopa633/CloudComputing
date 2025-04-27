using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.User.GetAllUser
{
    public record GetAllUserQuery() : IRequest<List<Entities.User>>;

    public class GetAllUserQueryHandler : IRequestHandler<GetAllUserQuery, List<Entities.User>>
    {
        private readonly AppDbContext _dbContext;
        public GetAllUserQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Entities.User>> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.Users.Include(u => u.UserRoles).AsNoTracking().ToListAsync(cancellationToken);
        }
    }
}
