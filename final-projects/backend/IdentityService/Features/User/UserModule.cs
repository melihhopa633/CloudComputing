using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using IdentityService.Features.User.CreateUser;
using IdentityService.Features.User.GetAllUser;
using IdentityService.Features.User.GetUser;
using IdentityService.Features.User.UpdateUser;
using IdentityService.Features.User.DeleteUser;
using IdentityService.Common;

namespace IdentityService.Features.User
{
    public class UserModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/users", async (CreateUserCommand command, IMediator mediator) =>
            {
                var id = await mediator.Send(command);
                return Results.Created($"/api/users/{id}", ApiResponse.SuccessResponse("User created", id));
            });

            app.MapGet("/api/users", async (IMediator mediator) =>
            {
                var users = await mediator.Send(new GetAllUserQuery());
                return Results.Ok(ApiResponse.SuccessResponse("Users fetched", users));
            });

            app.MapGet("/api/users/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var user = await mediator.Send(new GetUserByIdQuery(id));
                return user is not null
                    ? Results.Ok(ApiResponse.SuccessResponse("User fetched", user))
                    : Results.NotFound(ApiResponse.Fail("User not found"));
            });

            app.MapPut("/api/users/{id:guid}", async (Guid id, UpdateUserCommand command, IMediator mediator) =>
            {
                if (id != command.Id) return Results.BadRequest(ApiResponse.Fail("Id mismatch"));
                var updated = await mediator.Send(command);
                return updated
                    ? Results.Ok(ApiResponse.SuccessResponse("User updated"))
                    : Results.NotFound(ApiResponse.Fail("User not found"));
            });

            app.MapDelete("/api/users/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var deleted = await mediator.Send(new DeleteUserCommand(id));
                return deleted
                    ? Results.Ok(ApiResponse.SuccessResponse("User deleted"))
                    : Results.NotFound(ApiResponse.Fail("User not found"));
            });
        }
    }
}
