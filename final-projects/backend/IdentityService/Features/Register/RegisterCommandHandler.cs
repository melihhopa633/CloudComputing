using IdentityService.Entities;
using IdentityService.Persistence;
using IdentityService.Common;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using MediatR;

namespace IdentityService.Features.Register
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ApiResponse>
    {
        private readonly IRepository<User> _userRepository;
        public RegisterCommandHandler(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ApiResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            var existingUsers = await _userRepository.FindAsync(u => u.Email == command.Email);
            if (existingUsers.Any())
                return ApiResponse.Fail("Email already registered.");

            var user = new User
            {
                Username = command.Username,
                Email = command.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(command.Password),
                CreatedAt = DateTime.UtcNow,
                UserRoles = new List<UserRole>()
            };
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return ApiResponse.SuccessResponse("User registered successfully.");
        }
    }
}
