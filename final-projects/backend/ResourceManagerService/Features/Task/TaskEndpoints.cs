using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using ResourceManagerService.Features.Task;
using ResourceManagerService.Common;
using ResourceManagerService.Features.Task.CreateTask;
using ResourceManagerService.Features.Task.DeleteTask;
using ResourceManagerService.Features.Task.GetAllTask;
using ResourceManagerService.Features.Task.GetTask;

namespace ResourceManagerService.Features.Task
{
    public class TaskEndpoints : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/tasks", async (CreateTaskCommand command, ISender sender) =>
            {
                var id = await sender.Send(command);
                return Results.Created($"/api/tasks/{id}", ApiResponse.SuccessResponse("Task created", id));
            });

            app.MapGet("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var task = await sender.Send(new GetTaskQuery(id));
                return task is not null
                    ? Results.Ok(ApiResponse.SuccessResponse("Task found", task))
                    : Results.NotFound(ApiResponse.Fail("Task not found"));
            });

            app.MapGet("/api/tasks", async (ISender sender) =>
            {
                var tasks = await sender.Send(new GetAllTaskQuery());
                return Results.Ok(ApiResponse.SuccessResponse("Tasks listed", tasks));
            });

            app.MapDelete("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new DeleteTaskCommand(id));
                return result
                    ? Results.Ok(ApiResponse.SuccessResponse("Task deleted"))
                    : Results.NotFound(ApiResponse.Fail("Task not found"));
            });
        }
    }
} 