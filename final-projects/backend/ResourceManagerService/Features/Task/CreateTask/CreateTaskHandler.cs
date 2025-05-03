using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task
{
    public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, Guid>
    {
        private readonly AppDbContext _dbContext;
        public CreateTaskHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            var task = new Entities.Task
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ServiceType = request.ServiceType,
                ContainerId = string.Empty, // Docker entegrasyonu ile doldurulacak
                Port = 0, // Docker entegrasyonu ile doldurulacak
                StartTime = DateTime.UtcNow,
                Status = "Running"
            };
            _dbContext.Tasks.Add(task);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return task.Id;
        }
    }
} 