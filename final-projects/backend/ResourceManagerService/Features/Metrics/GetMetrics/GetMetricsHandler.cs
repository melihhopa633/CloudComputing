using MediatR;
using Microsoft.EntityFrameworkCore;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;

namespace ResourceManagerService.Features.Metrics.GetMetrics
{
    public class GetMetricsHandler : IRequestHandler<GetMetricsQuery, List<Metrics>>
    {
        private readonly AppDbContext _dbContext;

        public GetMetricsHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Metrics>> Handle(GetMetricsQuery request, CancellationToken cancellationToken)
        {
            return await _dbContext.Metrics
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
} 