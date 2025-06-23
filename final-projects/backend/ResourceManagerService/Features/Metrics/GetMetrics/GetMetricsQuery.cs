using MediatR;
using ResourceManagerService.Entities;
 
namespace ResourceManagerService.Features.Metrics.GetMetrics
{
    public record GetMetricsQuery() : IRequest<List<Entities.Metrics>>;
} 