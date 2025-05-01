using System.ComponentModel.DataAnnotations;
using MediatR;

namespace IdentityService.Features.Auth.Login;

public class LoginCommand : IRequest<LoginResponse>
{
    [Required]
    public required string Username { get; set; }
    
    [Required]
    public required string Password { get; set; }
} 