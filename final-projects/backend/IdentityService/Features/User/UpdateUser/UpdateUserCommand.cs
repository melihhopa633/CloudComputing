using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;
using IdentityService.Entities;

namespace IdentityService.Features.User.UpdateUser
{
    public record UpdateUserCommand(Guid Id, string Username, string Email) : IRequest<bool>;

    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public UpdateUserCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
            if (user == null) return false;
            user.Username = request.Username;
            user.Email = request.Email;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
