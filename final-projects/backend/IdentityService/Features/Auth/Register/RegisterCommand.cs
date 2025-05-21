// RegisterCommand.cs
using System.ComponentModel.DataAnnotations;
using MediatR;

namespace IdentityService.Features.Auth.Register;

public class RegisterCommand : IRequest<RegisterResponse>
{
    [Required]
    public required string FullName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
} 