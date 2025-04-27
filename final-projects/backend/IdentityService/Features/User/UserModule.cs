using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using IdentityService.Features.User.CreateUser;
using IdentityService.Features.User.GetAllUser;
using IdentityService.Features.User.GetUser;
using IdentityService.Features.User.UpdateUser;
using IdentityService.Features.User.DeleteUser;

namespace IdentityService.Features.User
{
    public class UserModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/users", async (CreateUserCommand command, IMediator mediator) =>
            {
                var id = await mediator.Send(command);
                return Results.Created($"/api/users/{id}", id);
            });

            app.MapGet("/api/users", async (IMediator mediator) =>
            {
                var users = await mediator.Send(new GetAllUserQuery());
                return Results.Ok(users);
            });

            app.MapGet("/api/users/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var user = await mediator.Send(new GetUserByIdQuery(id));
                return user is not null ? Results.Ok(user) : Results.NotFound();
            });

            app.MapPut("/api/users/{id:guid}", async (Guid id, UpdateUserCommand command, IMediator mediator) =>
            {
                if (id != command.Id) return Results.BadRequest();
                var updated = await mediator.Send(command);
                return updated ? Results.NoContent() : Results.NotFound();
            });

            app.MapDelete("/api/users/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var deleted = await mediator.Send(new DeleteUserCommand(id));
                return deleted ? Results.NoContent() : Results.NotFound();
            });
        }
    }
}
