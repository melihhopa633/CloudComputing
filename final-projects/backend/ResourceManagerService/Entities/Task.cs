using System;
using System.Collections.Generic;

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

        public List<TaskEvent> Events { get; set; } = new();
    }
} 