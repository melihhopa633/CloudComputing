using IdentityService.Entities;
using IdentityService.Persistence;
using IdentityService.Common;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace IdentityService.Features.Register
{
    public class RegisterCommandHandler
    {
        private readonly AppDbContext _dbContext;
        public RegisterCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse> Handle(RegisterCommand command)
        {
            // Check if user exists
            if (await _dbContext.Users.AnyAsync(u => u.Email == command.Email))
                return ApiResponse.Fail("Email already registered.");

            var user = new User
            {
                Username = command.Username,
                Email = command.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(command.Password),
                CreatedAt = DateTime.UtcNow,
                UserRoles = new List<UserRole>()
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return ApiResponse.SuccessResponse("User registered successfully.");
        }
    }
}
