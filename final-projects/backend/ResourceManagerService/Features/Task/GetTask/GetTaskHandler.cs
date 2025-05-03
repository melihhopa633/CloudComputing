using MediatR;
using ResourceManagerService.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task
{
    public class GetTaskHandler : IRequestHandler<GetTaskQuery, Entities.Task>
    {
        private readonly AppDbContext _dbContext;
        public GetTaskHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Entities.Task> Handle(GetTaskQuery request, CancellationToken cancellationToken)
        {
            // Events zaten Task ile birlikte jsonb olarak dönecek
            return await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
        }
    }
} 