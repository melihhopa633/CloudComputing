using System.ComponentModel.DataAnnotations;

namespace IdentityService.Features.Auth.Login;

public class LoginCommand
{
    [Required]
    public required string Username { get; set; }
    
    [Required]
    public required string Password { get; set; }
} 