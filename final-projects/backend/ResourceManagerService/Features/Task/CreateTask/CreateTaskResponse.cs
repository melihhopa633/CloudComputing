namespace ResourceManagerService.Features.Task.CreateTask
{
    public class CreateTaskResponse
    {
        public Guid Id { get; set; }
        public string ServiceType { get; set; }
        public string ContainerId { get; set; }
        public int Port { get; set; }
    }
}

