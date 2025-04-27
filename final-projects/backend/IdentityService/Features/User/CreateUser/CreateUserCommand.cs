using MediatR;
using System;

namespace IdentityService.Features.User.CreateUser
{
    public record CreateUserCommand(string Username, string Email, string Password) : IRequest<Guid>;
}
