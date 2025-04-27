using MediatR;
using IdentityService.Common;

namespace IdentityService.Features.Login
{
    public class LoginCommand : IRequest<ApiResponse>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
