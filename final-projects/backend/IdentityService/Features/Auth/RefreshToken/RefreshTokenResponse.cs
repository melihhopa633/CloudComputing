namespace IdentityService.Features.Auth.RefreshToken;

public class RefreshTokenResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required IEnumerable<string> Roles { get; set; }
} 