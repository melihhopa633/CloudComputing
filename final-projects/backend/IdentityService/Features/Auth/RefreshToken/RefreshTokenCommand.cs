using System.ComponentModel.DataAnnotations;
using MediatR;

namespace IdentityService.Features.Auth.RefreshToken;

public class RefreshTokenCommand : IRequest<RefreshTokenResponse>
{
    [Required]
    public required string RefreshToken { get; set; }
} 