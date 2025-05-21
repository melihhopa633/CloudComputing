using System.ComponentModel.DataAnnotations;
using MediatR;

namespace IdentityService.Features.Auth.Login;

public class LoginCommand : IRequest<LoginResponse>
{
    [Required]
    public required string Email { get; set; }
    
    [Required]
    public required string Password { get; set; }
} 