using MediatR;
using ResourceManagerService.Features.Task.GetAllTask;
using ResourceManagerService.Persistence;

namespace ResourceManagerService.Features.Task.GetAllTaskByUserId
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