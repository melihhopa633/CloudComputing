using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using ResourceManagerService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using Microsoft.EntityFrameworkCore;

namespace ResourceManagerService.Features.Task.CreateTask
{
    public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, CreateTaskResponse>
    {
        private readonly AppDbContext _dbContext;
        private readonly DockerService _dockerService;
        private readonly UserInfoService _userInfoService;
        public CreateTaskHandler(AppDbContext dbContext, DockerService dockerService, UserInfoService userInfoService)
        {
            _dbContext = dbContext;
            _dockerService = dockerService;
            _userInfoService = userInfoService;
        }

        public async Task<CreateTaskResponse> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            // Aynı kullanıcı için aynı servis tipinde zaten aktif bir task var mı kontrol et
            var existingTask = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.UserId == request.UserId && t.ServiceType == request.ServiceType && t.Status == "Running", cancellationToken);
            if (existingTask != null)
            {
                throw new InvalidOperationException($"Kullanıcı için bu servis zaten aktif: {request.ServiceType}");
            }
            try
            {
                // Kullanıcı bilgisini çek
                string userFullName = "Unknown User";
                try
                {
                    Console.WriteLine($"[CreateTaskHandler] Fetching user info for UserId: {request.UserId}");
                    var userInfo = await _userInfoService.GetUserInfoAsync(request.UserId);
                    Console.WriteLine($"[CreateTaskHandler] User info received - Email: {userInfo.Email}, FullName: {userInfo.FullName}");
                    userFullName = userInfo.FullName;
                    Console.WriteLine($"[CreateTaskHandler] UserFullName set to: {userFullName}");
                }
                catch (Exception ex)
                {
                    userFullName = $"ERROR: {ex.Message}";
                    Console.WriteLine($"[CreateTaskHandler] User info fetch error for UserId {request.UserId}: {ex.Message}");
                    Console.WriteLine($"[CreateTaskHandler] Exception details: {ex}");
                }

                // Docker container başlat (port otomatik bulunacak)
                var (containerId, port) = await _dockerService.StartContainerAsync(request.ServiceType);

                Console.WriteLine($"[CreateTaskHandler] Creating task with UserFullName: '{userFullName}'");
                var task = new Entities.Task
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    UserFullName = userFullName,
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
                Console.WriteLine($"[CreateTaskHandler] Task saved to database with UserFullName: '{task.UserFullName}'");
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
                    // Kullanıcı bilgisini çek (hata durumu için)
                    string errorUserFullName = "Unknown User";
                    try
                    {
                        var userInfo = await _userInfoService.GetUserInfoAsync(request.UserId);
                        errorUserFullName = userInfo.FullName;
                    }
                    catch
                    {
                        // Hata durumunda default değer kullan
                    }

                    // Docker hatası olduğunda özel bir task kaydı oluşturup kullanıcıyı bilgilendirebiliriz
                    var errorTask = new Entities.Task
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        UserFullName = errorUserFullName,
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