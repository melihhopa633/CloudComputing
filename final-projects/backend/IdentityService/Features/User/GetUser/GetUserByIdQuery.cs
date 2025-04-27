using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.User.GetUser
{
    public record GetUserByIdQuery(Guid Id) : IRequest<Entities.User?>;

    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, Entities.User?>
    {
        private readonly AppDbContext _dbContext;
        public GetUserByIdQueryHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Entities.User?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.Users.Include(u => u.UserRoles).SingleOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        }
    }
}
