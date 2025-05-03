using MediatR;
using ResourceManagerService.Persistence;

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
            // Events zaten Task ile birlikte jsonb olarak dönecek
            return _dbContext.Tasks.ToList();
        }
    }
} 