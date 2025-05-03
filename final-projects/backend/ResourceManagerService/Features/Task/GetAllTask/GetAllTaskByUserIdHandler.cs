using MediatR;
using ResourceManagerService.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace ResourceManagerService.Features.Task.GetAllTask
{
    public class GetAllTaskByUserIdHandler : IRequestHandler<GetAllTaskByUserIdQuery, List<Entities.Task>>
    {
        private readonly AppDbContext _dbContext;
        public GetAllTaskByUserIdHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Entities.Task>> Handle(GetAllTaskByUserIdQuery request, CancellationToken cancellationToken)
        {
            return _dbContext.Tasks
                .Where(t => t.UserId == request.UserId)
                .ToList();
        }
    }
} 