using IdentityService.Features.Auth.Login;
using IdentityService.Features.Auth.RefreshToken;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace IdentityService.Features.Auth;

public static class AuthModule
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", async (LoginCommand command, LoginCommandHandler handler) =>
        {
            var response = await handler.Handle(command);
            return Results.Ok(response);
        })
        .WithName("Login")
        .WithOpenApi()
        .AllowAnonymous();

        app.MapPost("/api/auth/refresh-token", async (RefreshTokenCommand command, RefreshTokenCommandHandler handler) =>
        {
            var response = await handler.Handle(command);
            return Results.Ok(response);
        })
        .WithName("RefreshToken")
        .WithOpenApi()
        .AllowAnonymous();
    }
} 