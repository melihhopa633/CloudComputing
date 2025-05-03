using MediatR;
using ResourceManagerService.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task
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
            return _dbContext.Tasks.ToList();
        }
    }
} 