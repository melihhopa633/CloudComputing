using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using ResourceManagerService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task.DeleteTask
{
    public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        private readonly DockerService _dockerService;
        public DeleteTaskHandler(AppDbContext dbContext, DockerService dockerService)
        {
            _dbContext = dbContext;
            _dockerService = dockerService;
        }

        public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) return false;

            // Docker container'ı durdur ve sil
            if (!string.IsNullOrWhiteSpace(task.ContainerId))
            {
                await _dockerService.StopAndRemoveContainerAsync(task.ContainerId);
            }

            task.Status = "Deleted";
            task.StopTime = DateTime.UtcNow;
            task.Duration = task.StopTime - task.StartTime;
            task.Events.Add(new TaskEventData
            {
                Type = "Deleted",
                Details = "Task deleted and container stopped"
            });
           
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 