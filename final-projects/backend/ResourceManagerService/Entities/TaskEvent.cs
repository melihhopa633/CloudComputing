using System;

namespace ResourceManagerService.Entities
{
    public class TaskEvent
    {
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Type { get; set; }
        public string? Details { get; set; }
    }
} 