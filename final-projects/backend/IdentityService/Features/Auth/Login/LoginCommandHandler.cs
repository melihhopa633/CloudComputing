using IdentityService.Common.Exceptions;
using IdentityService.Persistence;
using IdentityService.Security;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace IdentityService.Features.Auth.Login;

public class LoginCommandHandler
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public LoginCommandHandler(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse> Handle(LoginCommand command)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == command.Username);

        if (user == null)
            throw new UnauthorizedException("Invalid username or password");

        var passwordHash = ComputeHash(command.Password);
        if (passwordHash != user.PasswordHash)
            throw new UnauthorizedException("Invalid username or password");

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken(user);
        
        // Update user's refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();
        
        return new LoginResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            Username = user.Username,
            Email = user.Email,
            Roles = user.UserRoles.Select(ur => ur.Role.RoleName)
        };
    }

    private string ComputeHash(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
} 