namespace IdentityService.Features.Auth.Login;
using System.Text.Json.Serialization;

public class LoginResponse
{
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required IEnumerable<string> Roles { get; set; }
    [JsonPropertyName("userId")]
    public required Guid UserId { get; set; }
} 