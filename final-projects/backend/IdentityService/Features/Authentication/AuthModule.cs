using Carter;
using IdentityService.Features.Register;
using IdentityService.Features.Login;
using IdentityService.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Features.Authentication
{
    public class AuthModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/auth/register", async (RegisterCommand command, RegisterCommandHandler handler) =>
            {
                var result = await handler.Handle(command);
                return Results.Json(result);
            });

            app.MapPost("/api/auth/login", async (LoginCommand command, LoginCommandHandler handler) =>
            {
                var result = await handler.Handle(command);
                return Results.Json(result);
            });
        }
    }
}
