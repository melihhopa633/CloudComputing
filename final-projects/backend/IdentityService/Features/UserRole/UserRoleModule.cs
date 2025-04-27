using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using IdentityService.Common;
using IdentityService.Features.UserRole.CreateUserRole;
using IdentityService.Features.UserRole.GetAllUserRole;
using IdentityService.Features.UserRole.GetUserRole;
using IdentityService.Features.UserRole.DeleteUserRole;
using IdentityService.Features.UserRole.UpdateUserRole;
using IdentityService.Entities;

namespace IdentityService.Features.UserRole
{
    public class UserRoleModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/userroles", async (CreateUserRoleCommand command, IMediator mediator) =>
            {
                var id = await mediator.Send(command);
                return Results.Created($"/api/userroles/{id}", ApiResponse.SuccessResponse("UserRole created", id));
            });

            app.MapGet("/api/userroles", async (IMediator mediator) =>
            {
                var userRoles = await mediator.Send(new GetAllUserRoleQuery());
                return Results.Ok(ApiResponse.SuccessResponse("UserRoles fetched", userRoles));
            });

            app.MapGet("/api/userroles/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var userRole = await mediator.Send(new GetUserRoleByIdQuery(id));
                return userRole is not null
                    ? Results.Ok(ApiResponse.SuccessResponse("UserRole fetched", userRole))
                    : Results.NotFound(ApiResponse.Fail("UserRole not found"));
            });

            app.MapDelete("/api/userroles/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var deleted = await mediator.Send(new DeleteUserRoleCommand(id));
                return deleted
                    ? Results.Ok(ApiResponse.SuccessResponse("UserRole deleted"))
                    : Results.NotFound(ApiResponse.Fail("UserRole not found"));
            });

            app.MapPut("/api/userroles/{id:guid}", async (Guid id, UpdateUserRoleCommand command, IMediator mediator) =>
            {
                if (id != command.Id) return Results.BadRequest(ApiResponse.Fail("Id mismatch"));
                var updated = await mediator.Send(command);
                return updated
                    ? Results.Ok(ApiResponse.SuccessResponse("UserRole updated"))
                    : Results.NotFound(ApiResponse.Fail("UserRole not found or invalid user/role"));
            });
        }
    }
}
