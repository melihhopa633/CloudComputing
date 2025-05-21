// RegisterCommandHandler.cs
// ... 
using IdentityService.Common.Exceptions;
using IdentityService.Entities;
using IdentityService.Persistence;
using IdentityService.Security;
using Microsoft.EntityFrameworkCore;
using MediatR;
using FluentValidation.Results;
using BCrypt.Net;
using FluentValidation;
using IdentityService.Features.Auth.Register;

namespace IdentityService.Features.Auth.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public RegisterCommandHandler(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<RegisterResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
    {
        if (await _context.Users.AnyAsync(u => u.Email == command.Email, cancellationToken))
        {
            var failures = new List<ValidationFailure>
            {
                new ValidationFailure("Email", "A user with this email already exists.")
            };
            throw new ValidationException(failures);
        }

        var user = new IdentityService.Entities.User
        {
            Id = Guid.NewGuid(),
            Username = command.FullName,
            Email = command.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(command.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken(user);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync(cancellationToken);

        return new RegisterResponse
        {
            Token = token,
            RefreshToken = refreshToken
        };
    }
} 