using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using ResourceManagerService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;

namespace ResourceManagerService.Features.Task.CreateTask
{
    public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, CreateTaskResponse>
    {
        private readonly AppDbContext _dbContext;
        private readonly DockerService _dockerService;
        public CreateTaskHandler(AppDbContext dbContext, DockerService dockerService)
        {
            _dbContext = dbContext;
            _dockerService = dockerService;
        }

        public async Task<CreateTaskResponse> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Docker container başlat (port otomatik bulunacak)
                var (containerId, port) = await _dockerService.StartContainerAsync(request.ServiceType);

                var task = new Entities.Task
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    ServiceType = request.ServiceType,
                    ContainerId = containerId,
                    Port = port,
                    StartTime = DateTime.UtcNow,
                    Status = "Running",
                    Events = new List<TaskEventData>
                    {
                        new TaskEventData
                        {
                            Type = "Created",
                            Details = "Task created and container started"
                        }
                    }
                };
                _dbContext.Tasks.Add(task);
                await _dbContext.SaveChangesAsync(cancellationToken);
                return new CreateTaskResponse()
                {
                    Id = task.Id,
                    ServiceType = task.ServiceType,
                    ContainerId = task.ContainerId,
                    Port = task.Port,
                };
            }
            catch (Exception ex)
            {
                // Docker hataları için daha açıklayıcı mesaj
                if (ex.Message.Contains("docker") || ex is FileNotFoundException || ex.InnerException is FileNotFoundException)
                {
                    Console.WriteLine($"Docker hatası: {ex.Message}");
                    // Docker hatası olduğunda özel bir task kaydı oluşturup kullanıcıyı bilgilendirebiliriz
                    var errorTask = new Entities.Task
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        ServiceType = request.ServiceType,
                        ContainerId = "error",
                        Port = 0,
                        StartTime = DateTime.UtcNow,
                        Status = "Error",
                        Events = new List<TaskEventData>
                        {
                            new TaskEventData
                            {
                                Type = "Error",
                                Details = $"Docker hizmeti kullanılamıyor: {ex.Message}"
                            }
                        }
                    };
                    
                    _dbContext.Tasks.Add(errorTask);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    
                    // Yine de hatayı fırlat
                    throw new InvalidOperationException("Docker hizmeti erişilebilir değil. Docker yüklü ve çalışır durumda olduğundan emin olun.", ex);
                }
                throw;
            }
        }
    }
} 