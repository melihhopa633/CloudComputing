using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ResourceManagerService.Entities
{
    public class Task
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ServiceType { get; set; }
        public string ContainerId { get; set; }
        public int Port { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? StopTime { get; set; }
        public TimeSpan? Duration { get; set; }
        public string Status { get; set; } // Running, Stopped, Error

        public List<TaskEventData> Events { get; set; } = new();
    }

    public class TaskEventData
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Type { get; set; }
        public string Details { get; set; }
    }
} 