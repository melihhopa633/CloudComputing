using ResourceManagerService.Entities;

namespace ResourceManagerService.Persistence
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Örnek seed: Eğer hiç task yoksa bir tane ekle
            if (!context.Tasks.Any())
            {
                var task = new ResourceManagerService.Entities.Task
                {
                    Id = Guid.NewGuid(),
                    UserId = Guid.NewGuid(),
                    ServiceType = "jupyter",
                    ContainerId = "",
                    Port = 8888,
                    StartTime = DateTime.UtcNow,
                    Status = "Stopped",
                    Events = new List<TaskEventData>
                    {
                        new TaskEventData
                        {
                            Type = "Created",
                            Details = "Task created successfully"
                        }
                    }
                };
                context.Tasks.Add(task);
                context.SaveChanges();
            }
        }
    }
} 