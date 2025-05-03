using MediatR;
using Microsoft.EntityFrameworkCore;
using ResourceManagerService.Persistence;
using System.Linq;

namespace ResourceManagerService.Features.Task.GetAllTask
{
    public class GetAllTaskHandler : IRequestHandler<GetAllTaskQuery, List<Entities.Task>>
    {
        private readonly AppDbContext _dbContext;
        public GetAllTaskHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Entities.Task>> Handle(GetAllTaskQuery request, CancellationToken cancellationToken)
        {
            var query = _dbContext.Tasks.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Status))
                query = query.Where(t => t.Status == request.Status);
            if (!string.IsNullOrWhiteSpace(request.ServiceType))
                query = query.Where(t => t.ServiceType == request.ServiceType);
            if (request.UserId.HasValue)
                query = query.Where(t => t.UserId == request.UserId.Value);

            // Sıralama
            var orderBy = request.OrderBy?.ToLower() ?? "starttime";
            var order = request.Order?.ToLower() ?? "desc";
            query = (orderBy, order) switch
            {
                ("starttime", "asc") => query.OrderBy(t => t.StartTime),
                ("starttime", _) => query.OrderByDescending(t => t.StartTime),
                ("stoptime", "asc") => query.OrderBy(t => t.StopTime),
                ("stoptime", _) => query.OrderByDescending(t => t.StopTime),
                ("status", "asc") => query.OrderBy(t => t.Status),
                ("status", _) => query.OrderByDescending(t => t.Status),
                ("servicetype", "asc") => query.OrderBy(t => t.ServiceType),
                ("servicetype", _) => query.OrderByDescending(t => t.ServiceType),
                _ => query.OrderByDescending(t => t.StartTime)
            };

            return await query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
} 