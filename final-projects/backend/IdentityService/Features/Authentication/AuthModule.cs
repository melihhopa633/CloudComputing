using Carter;
using IdentityService.Features.Register;
using IdentityService.Features.Login;
using IdentityService.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace IdentityService.Features.Authentication
{
    public class AuthModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/auth/register", async (IMediator mediator, RegisterCommand command) =>
            {
                var result = await mediator.Send(command);
                return Results.Json(result);
            });

            app.MapPost("/api/auth/login", async (IMediator mediator, LoginCommand command) =>
            {
                var result = await mediator.Send(command);
                return Results.Json(result);
            });
        }
    }
}
