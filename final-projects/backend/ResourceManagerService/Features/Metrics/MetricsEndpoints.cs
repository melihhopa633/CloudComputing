using Carter;
using MediatR;
using ResourceManagerService.Features.Metrics.GetMetrics;
using ResourceManagerService.Common;

namespace ResourceManagerService.Features.Metrics
{
    public class MetricsEndpoints : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/metrics", async (ISender sender) =>
            {
                var metrics = await sender.Send(new GetMetricsQuery());
                return Results.Ok(ApiResponse.SuccessResponse("Metrics retrieved successfully", metrics));
            });
        }
    }
} 