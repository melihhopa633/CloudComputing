using IdentityService.Common.Exceptions;
using IdentityService.Persistence;
using IdentityService.Security;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Features.Auth.RefreshToken;

public class RefreshTokenCommandHandler
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public RefreshTokenCommandHandler(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand command)
    {
        // First validate the refresh token format
        if (!_jwtService.ValidateToken(command.RefreshToken, isRefreshToken: true))
            throw new UnauthorizedException("Invalid refresh token format");

        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.RefreshToken == command.RefreshToken);

        if (user == null)
            throw new UnauthorizedException("Invalid refresh token");

        if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedException("Refresh token expired");

        // Generate new tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken(user);
        
        // Update user's refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return new RefreshTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Username = user.Username,
            Email = user.Email,
            Roles = user.UserRoles.Select(ur => ur.Role.RoleName)
        };
    }
} 