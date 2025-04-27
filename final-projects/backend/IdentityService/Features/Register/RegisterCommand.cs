using MediatR;
using IdentityService.Common;

namespace IdentityService.Features.Register
{
    public class RegisterCommand : IRequest<ApiResponse>
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
