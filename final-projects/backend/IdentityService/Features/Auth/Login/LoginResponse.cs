namespace IdentityService.Features.Auth.Login;

public class LoginResponse
{
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required IEnumerable<string> Roles { get; set; }
} 