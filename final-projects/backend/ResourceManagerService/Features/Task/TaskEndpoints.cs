using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using ResourceManagerService.Features.Task;

namespace ResourceManagerService.Features.Task
{
    public class TaskEndpoints : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/tasks", async (CreateTaskCommand command, ISender sender) =>
            {
                var id = await sender.Send(command);
                return Results.Created($"/api/tasks/{id}", id);
            });

            app.MapGet("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var task = await sender.Send(new GetTaskQuery(id));
                return task is not null ? Results.Ok(task) : Results.NotFound();
            });

            app.MapGet("/api/tasks", async (ISender sender) =>
            {
                var tasks = await sender.Send(new GetAllTaskQuery());
                return Results.Ok(tasks);
            });

            app.MapDelete("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new DeleteTaskCommand(id));
                return result ? Results.NoContent() : Results.NotFound();
            });
        }
    }
} 