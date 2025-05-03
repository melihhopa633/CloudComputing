using MediatR;
using ResourceManagerService.Persistence;
using ResourceManagerService.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task
{
    public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        public DeleteTaskHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) return false;
            task.Status = "Deleted";
            task.Events.Add(new TaskEventData
            {
                Type = "Deleted",
                Details = "Task deleted successfully"
            });
            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 