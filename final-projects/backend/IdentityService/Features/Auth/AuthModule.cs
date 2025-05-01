using Carter;
using IdentityService.Features.Auth.Login;
using IdentityService.Features.Auth.RefreshToken;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using MediatR;

namespace IdentityService.Features.Auth;

public class AuthModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", async (LoginCommand command, ISender mediator) =>
        {
            var response = await mediator.Send(command);
            return Results.Ok(response);
        })
        .WithName("Login")
        .WithOpenApi()
        .AllowAnonymous();

        app.MapPost("/api/auth/refresh-token", async (RefreshTokenCommand command, ISender mediator) =>
        {
            var response = await mediator.Send(command);
            return Results.Ok(response);
        })
        .WithName("RefreshToken")
        .WithOpenApi()
        .AllowAnonymous();
    }
} 