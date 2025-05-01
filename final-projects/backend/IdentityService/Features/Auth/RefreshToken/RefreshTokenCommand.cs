using System.ComponentModel.DataAnnotations;

namespace IdentityService.Features.Auth.RefreshToken;

public class RefreshTokenCommand
{
    [Required]
    public required string RefreshToken { get; set; }
} 