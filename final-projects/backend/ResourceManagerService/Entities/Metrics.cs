using System;

namespace ResourceManagerService.Entities
{
    public class Metrics
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserEmail { get; set; }
        public string UserFullName { get; set; }
        public string ContainerId { get; set; }
        public string ContainerName { get; set; }
        public string MemoryMB { get; set; }
        public string CpuUsage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 