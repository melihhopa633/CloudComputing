using MediatR;

namespace ResourceManagerService.Features.Task.ReportMetrics
{
    public record ReportMetricsCommand(Guid Id) : IRequest<bool>;
} 