namespace IdentityService.Features.Auth.Register;

public class RegisterResponse
{
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
} 