using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using IdentityService.Common;
using IdentityService.Features.Role.CreateRole;
using IdentityService.Features.Role.GetAllRole;
using IdentityService.Features.Role.GetRole;
using IdentityService.Features.Role.UpdateRole;
using IdentityService.Features.Role.DeleteRole;

namespace IdentityService.Features.Role
{
    public class RoleModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/roles", async (CreateRoleCommand command, IMediator mediator) =>
            {
                var id = await mediator.Send(command);
                return Results.Created($"/api/roles/{id}", ApiResponse.SuccessResponse("Role created", id));
            });

            app.MapGet("/api/roles", async (IMediator mediator) =>
            {
                var roles = await mediator.Send(new GetAllRoleQuery());
                return Results.Ok(ApiResponse.SuccessResponse("Roles fetched", roles));
            });

            app.MapGet("/api/roles/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var role = await mediator.Send(new GetRoleByIdQuery(id));
                return role is not null
                    ? Results.Ok(ApiResponse.SuccessResponse("Role fetched", role))
                    : Results.NotFound(ApiResponse.Fail("Role not found"));
            });

            app.MapPut("/api/roles/{id:guid}", async (Guid id, UpdateRoleCommand command, IMediator mediator) =>
            {
                if (id != command.Id) return Results.BadRequest(ApiResponse.Fail("Id mismatch"));
                var updated = await mediator.Send(command);
                return updated
                    ? Results.Ok(ApiResponse.SuccessResponse("Role updated"))
                    : Results.NotFound(ApiResponse.Fail("Role not found"));
            });

            app.MapDelete("/api/roles/{id:guid}", async (Guid id, IMediator mediator) =>
            {
                var deleted = await mediator.Send(new DeleteRoleCommand(id));
                return deleted
                    ? Results.Ok(ApiResponse.SuccessResponse("Role deleted"))
                    : Results.NotFound(ApiResponse.Fail("Role not found"));
            });
        }
    }
}
