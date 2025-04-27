using IdentityService.Entities;
using IdentityService.Persistence;
using IdentityService.Common;
using IdentityService.Security;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using MediatR;

namespace IdentityService.Features.Login
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse>
    {
        private readonly IRepository<User> _userRepository;
        private readonly JwtService _jwtService;
        public LoginCommandHandler(IRepository<User> userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<ApiResponse> Handle(LoginCommand command, CancellationToken cancellationToken)
        {
            var users = await _userRepository.FindAsync(u => u.Email == command.Email);
            var user = users.FirstOrDefault();
            if (user == null || !BCrypt.Net.BCrypt.Verify(command.Password, user.PasswordHash))
                return ApiResponse.Fail("Invalid credentials.");

            var token = _jwtService.GenerateToken(user);
            return ApiResponse.SuccessResponse("Login successful.", new { token });
        }
    }
}
