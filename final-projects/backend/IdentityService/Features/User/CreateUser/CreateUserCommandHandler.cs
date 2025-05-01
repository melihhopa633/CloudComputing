using MediatR;
using Microsoft.EntityFrameworkCore;
using IdentityService.Persistence;

namespace IdentityService.Features.User.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly AppDbContext _dbContext;
        public CreateUserCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
                throw new Exception("Email already registered.");

            var user = new Entities.User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return user.Id;
        }
    }
}
