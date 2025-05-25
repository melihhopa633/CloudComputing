using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using ResourceManagerService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace ResourceManagerService.Features.Task.DeleteTask
{
    public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        private readonly DockerService _dockerService;
        private readonly ILogger<DeleteTaskHandler> _logger;

        public DeleteTaskHandler(
            AppDbContext dbContext, 
            DockerService dockerService, 
            ILogger<DeleteTaskHandler> logger)
        {
            _dbContext = dbContext;
            _dockerService = dockerService;
            _logger = logger;
            
            _logger.LogInformation("DeleteTaskHandler initialized.");
        }

        public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) return false;

            // Docker container'ı durdur ve sil
            try
            {
                if (!string.IsNullOrWhiteSpace(task.ContainerId))
                {
                    _logger.LogInformation($"Stopping container: {task.ContainerId}");
                    await _dockerService.StopAndRemoveContainerAsync(task.ContainerId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error stopping container: {ex.Message}");
                // Container durdurma hatası olduğunda devam et
            }

            task.Status = "Deleted";
            task.StopTime = DateTime.UtcNow;
            task.Duration = task.StopTime - task.StartTime;
            var list = task.Events.ToList();
            
            list.Add(new TaskEventData  
            {
                Type = "Deleted",
                Details = "Task deleted and container stopped"
            });
            task.Events = list;
           
            await _dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class DeleteAllTasksHandler : IRequestHandler<DeleteAllTasksCommand, bool>
    {
        private readonly AppDbContext _db;
        public DeleteAllTasksHandler(AppDbContext db)
        {
            _db = db;
        }
        public async Task<bool> Handle(DeleteAllTasksCommand request, CancellationToken cancellationToken)
        {
            var allTasks = _db.Tasks.ToList();
            _db.Tasks.RemoveRange(allTasks);
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }
    }

    public class DeleteTasksByServiceTypeCommand : IRequest<bool>
    {
        public string ServiceType { get; set; }
        public DeleteTasksByServiceTypeCommand(string serviceType)
        {
            ServiceType = serviceType;
        }
    }

    public class DeleteTasksByServiceTypeHandler : IRequestHandler<DeleteTasksByServiceTypeCommand, bool>
    {
        private readonly AppDbContext _db;
        public DeleteTasksByServiceTypeHandler(AppDbContext db)
        {
            _db = db;
        }
        public async Task<bool> Handle(DeleteTasksByServiceTypeCommand request, CancellationToken cancellationToken)
        {
            var tasks = _db.Tasks.Where(t => t.ServiceType.ToLower() == request.ServiceType.ToLower()).ToList();
            _db.Tasks.RemoveRange(tasks);
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 