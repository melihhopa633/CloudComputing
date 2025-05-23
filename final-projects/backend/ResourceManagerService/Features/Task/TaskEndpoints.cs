using Carter;
using MediatR;
using Microsoft.AspNetCore.Http;
using ResourceManagerService.Features.Task;
using ResourceManagerService.Common;
using ResourceManagerService.Features.Task.CreateTask;
using ResourceManagerService.Features.Task.DeleteTask;
using ResourceManagerService.Features.Task.GetAllTask;
using ResourceManagerService.Features.Task.GetAllTaskByUserId;
using ResourceManagerService.Features.Task.GetTask;
using ResourceManagerService.Features.Task.ReportMetrics;
using ResourceManagerService.Services;

namespace ResourceManagerService.Features.Task
{
    public class TaskEndpoints : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/tasks", async (CreateTaskCommand command, ISender sender) =>
            {
                var response = await sender.Send(command);
                return Results.Ok(ApiResponse.SuccessResponse("Task created", response));
            });

            app.MapGet("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var task = await sender.Send(new GetTaskQuery(id));
                return task is not null
                    ? Results.Ok(ApiResponse.SuccessResponse("Task found", task))
                    : Results.NotFound(ApiResponse.Fail("Task not found"));
            });

            app.MapGet("/api/tasks", async (
                string? status,
                string? serviceType,
                Guid? userId,
                string? orderBy,
                string? order,
                ISender sender) =>
            {
                var tasks = await sender.Send(new GetAllTaskQuery(
                    Status: status,
                    ServiceType: serviceType,
                    UserId: userId,
                    OrderBy: orderBy,
                    Order: order
                ));
                return Results.Ok(ApiResponse.SuccessResponse("Tasks listed", tasks));
            });

            app.MapDelete("/api/tasks/{id:guid}", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new DeleteTaskCommand(id));
                return result
                    ? Results.Ok(ApiResponse.SuccessResponse("Task deleted"))
                    : Results.NotFound(ApiResponse.Fail("Task not found"));
            });

            app.MapGet("/api/tasks/user/{userId:guid}", async (Guid userId, ISender sender) =>
            {
                var tasks = await sender.Send(new GetAllTaskByUserIdQuery(userId));
                return Results.Ok(ApiResponse.SuccessResponse("User's tasks listed", tasks));
            });

            app.MapPost("/api/tasks/{id:guid}/metrics", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new ReportMetricsCommand(id));
                return result
                    ? Results.Ok(ApiResponse.SuccessResponse("Task metrics reported to blockchain"))
                    : Results.NotFound(ApiResponse.Fail("Task not found"));
            });

            app.MapDelete("/api/tasks/all", async (ISender sender) =>
            {
                var result = await sender.Send(new DeleteTask.DeleteAllTasksCommand());
                return result
                    ? Results.Ok(ApiResponse.SuccessResponse("All tasks deleted"))
                    : Results.Problem("Failed to delete all tasks");
            });

            app.MapDelete("/api/tasks/service/{serviceType}", async (string serviceType, ISender sender) =>
            {
                var result = await sender.Send(new DeleteTask.DeleteTasksByServiceTypeCommand(serviceType));
                return result
                    ? Results.Ok(ApiResponse.SuccessResponse($"All tasks for service {serviceType} deleted"))
                    : Results.Problem($"Failed to delete tasks for service {serviceType}");
            });

            app.MapGet("/api/services", (DockerService dockerService) =>
            {
                var services = DockerService.GetAllServiceInfos();
                return Results.Ok(ApiResponse.SuccessResponse("Service list", services));
            });
        }
    }
} 