using IdentityService.Entities;
using IdentityService.Persistence;
using IdentityService.Common;
using IdentityService.Security;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace IdentityService.Features.Login
{
    public class LoginCommandHandler
    {
        private readonly AppDbContext _dbContext;
        private readonly JwtService _jwtService;
        public LoginCommandHandler(AppDbContext dbContext, JwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public async Task<ApiResponse> Handle(LoginCommand command)
        {
            var user = await _dbContext.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Email == command.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(command.Password, user.PasswordHash))
                return ApiResponse.Fail("Invalid credentials.");

            var token = _jwtService.GenerateToken(user);
            return ApiResponse.SuccessResponse("Login successful.", new { token });
        }
    }
}
