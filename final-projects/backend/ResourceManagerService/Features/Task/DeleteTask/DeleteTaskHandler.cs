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
        private readonly MetricsService _metricsService;
        public DeleteTaskHandler(AppDbContext dbContext, DockerService dockerService, MetricsService metricsService)
        {
            _dbContext = dbContext;
            _dockerService = dockerService;
            _metricsService = metricsService;
        }

        public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) return false;

            // Container'ın son RAM ve CPU kullanımını ölç
            string memoryUsage = "0";
            string cpuUsage = "0";
            try 
            {
                if (!string.IsNullOrWhiteSpace(task.ContainerId))
                {
                    memoryUsage = await _metricsService.GetContainerMemoryUsageAsync(task.ContainerId);
                    // noktadan sonrasını sil
                    if (memoryUsage.Contains('.'))
                        memoryUsage = memoryUsage.Substring(0, memoryUsage.IndexOf('.'));
                    cpuUsage = await _metricsService.GetContainerCpuUsageAsync(task.ContainerId);
                }
            }
            catch (Exception ex)
            {
                // Metrik okuma hatası olursa "-1" olarak işaretle
                memoryUsage = "-1";
                cpuUsage = "-1";
            }

            // Docker container'ı durdur ve sil
            if (!string.IsNullOrWhiteSpace(task.ContainerId))
                await _dockerService.StopAndRemoveContainerAsync(task.ContainerId);

            task.Status = "Deleted";
            task.StopTime = DateTime.UtcNow;
            task.Duration = task.StopTime - task.StartTime;
            var list = task.Events.ToList();
            
            // RAM'i MB'a çevir
            string memoryMB = "-1";
            if (double.TryParse(memoryUsage, out double memBytes) && memBytes >= 0)
            {
                memoryMB = (memBytes / (1024 * 1024)).ToString("F2");
            }
            
            list.Add(new TaskEventData  
            {
                Type = "Deleted",
                Details = $"Task deleted and container stopped. Last metrics - Memory: {memoryMB} MB, CPU: {cpuUsage}"
            });
            task.Events = list;
           
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 