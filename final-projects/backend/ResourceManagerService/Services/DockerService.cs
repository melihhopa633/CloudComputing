using System.Diagnostics;

namespace ResourceManagerService.Services
{
    public class DockerService
    {
        // serviceType -> docker image mapping
        public static readonly Dictionary<string, string> ServiceTypeToImage = new()
        {
            { "jupyter", "jupyter/base-notebook" },
            // Diğer servisler buraya eklenebilir
        };

        public async Task<(string containerId, int port)> StartContainerAsync(string serviceType, int port)
        {
            if (!ServiceTypeToImage.TryGetValue(serviceType, out var image))
                throw new KeyNotFoundException($"Unknown serviceType: {serviceType}");

            // Docker run komutu
            var psi = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"run -d -p {port}:8888 {image}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            using var process = Process.Start(psi);
            string containerId = await process.StandardOutput.ReadLineAsync() ?? string.Empty;
            await process.WaitForExitAsync();
            if (string.IsNullOrWhiteSpace(containerId))
                throw new System.Exception($"Docker run failed: {await process.StandardError.ReadToEndAsync()}");
            return (containerId.Trim(), port);
        }

        public async Task StopAndRemoveContainerAsync(string containerId)
        {
            // docker stop
            var stop = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"stop {containerId}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            using (var process = Process.Start(stop))
            {
                await process.WaitForExitAsync();
            }
            // docker rm
            var rm = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"rm {containerId}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            using (var process = Process.Start(rm))
            {
                await process.WaitForExitAsync();
            }
        }
    }
} 