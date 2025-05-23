using System.Diagnostics;
using System.Net.Sockets;

namespace ResourceManagerService.Services
{
    public class DockerService
    {
        private class DockerServiceConfig
        {
            public string Image { get; set; }
            public int ContainerPort { get; set; }
            public Dictionary<string, string>? Environment { get; set; }
            public string? ExtraArgs { get; set; }
        }

private static readonly Dictionary<string, DockerServiceConfig> ServiceMap = new()
{
    {
        "filebrowser", new DockerServiceConfig
        {
            Image = "filebrowser/filebrowser",
            ContainerPort = 80
        }
    },
    {
        "theia", new DockerServiceConfig
        {
            Image = "elswork/theia",
            ContainerPort = 3000
        }
    },
    {
        "drawio", new DockerServiceConfig
        {
            Image = "fjudith/draw.io",
            ContainerPort = 8080
        }
    },
    {
        "excalidraw", new DockerServiceConfig
        {
            Image = "excalidraw/excalidraw",
            ContainerPort = 80
        }
    },
  
    {
        "jsoneditor", new DockerServiceConfig
        {
            Image = "djmattyg007/jsoneditor",
            ContainerPort = 80
        }
    },
    // 1) Etherpad-lite: Basit ortak metin düzenleyici
    {
        "etherpad", new DockerServiceConfig
        {
            Image = "etherpad/etherpad",
            ContainerPort = 9001
        }
    },
};



        public async Task<(string containerId, int hostPort)> StartContainerAsync(string serviceType)
        {
            if (!ServiceMap.TryGetValue(serviceType, out var config))
                throw new KeyNotFoundException($"Unknown serviceType: {serviceType}");

            string image = config.Image;
            int containerPort = config.ContainerPort;
            int hostPort = GetAvailablePort(10000, 60000);

            try
            {
                // Docker versiyonunu kontrol et
                await CheckDockerAvailabilityAsync();

                if (!await DockerImageExists(image))
                {
                    Console.WriteLine($"📦 Pulling missing image: {image}");
                    await DockerPullImage(image);
                }

                string envPart = string.Empty;
                if (config.Environment is { Count: > 0 })
                {
                    envPart = string.Join(" ", config.Environment.Select(kv => $"-e {kv.Key}=\"{kv.Value}\""));
                }

                string extraArgs = string.IsNullOrWhiteSpace(config.ExtraArgs) ? "" : $" {config.ExtraArgs}";

                string runArgs = $"run -d -p {hostPort}:{containerPort} {envPart} {image}{extraArgs}";
                Console.WriteLine($"Docker command: docker {runArgs}");

                var psi = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = runArgs,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process == null)
                {
                    throw new Exception("Failed to start Docker process");
                }

                string containerId = await process.StandardOutput.ReadLineAsync() ?? string.Empty;
                await process.WaitForExitAsync();
        
                // fetch first 12 characters of containerId
                containerId = containerId.Length > 12 ? containerId.Substring(0, 12) : containerId;
                
                if (string.IsNullOrWhiteSpace(containerId) || process.ExitCode != 0)
                {
                    string errorOutput = await process.StandardError.ReadToEndAsync();
                    throw new Exception($"❌ Docker run failed: {errorOutput}");
                }
                
                return (containerId, hostPort);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Docker işlemi başarısız: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        private async Task CheckDockerAvailabilityAsync()
        {
            var psi = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = "--version",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            try
            {
                using var process = Process.Start(psi);
                if (process == null)
                {
                    throw new Exception("Failed to start Docker process during version check");
                }

                string output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    string errorOutput = await process.StandardError.ReadToEndAsync();
                    throw new Exception($"Docker version check failed: {errorOutput}");
                }

                Console.WriteLine($"Docker version: {output.Trim()}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Docker kullanılamıyor: {ex.Message}");
                throw new Exception("Docker is not available or correctly configured", ex);
            }
        }

        public async Task StopAndRemoveContainerAsync(string containerId)
        {
            foreach (var command in new[] { $"stop {containerId}", $"rm {containerId}" })
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = command,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    string error = await process.StandardError.ReadToEndAsync();
                    Console.Error.WriteLine($"⚠️ Docker command '{command}' failed: {error}");
                }
            }
        }

        private int GetAvailablePort(int minPort, int maxPort)
        {
            var random = new Random();
            for (int i = 0; i < 100; i++)
            {
                int port = random.Next(minPort, maxPort + 1);
                if (IsPortAvailable(port))
                    return port;
            }

            throw new Exception("❌ No available port found in the specified range.");
        }

        private bool IsPortAvailable(int port)
        {
            try
            {
                TcpListener listener = new TcpListener(System.Net.IPAddress.Loopback, port);
                listener.Start();
                listener.Stop();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> DockerImageExists(string imageName)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"image inspect {imageName}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            await process.WaitForExitAsync();
            return process.ExitCode == 0;
        }

        private async Task DockerPullImage(string imageName)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"pull {imageName}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
            {
                string error = await process.StandardError.ReadToEndAsync();
                throw new Exception($"❌ Failed to pull image '{imageName}':\n{error}");
            }
        }

        public static List<object> GetAllServiceInfos()
        {
            return ServiceMap.Select(kv => new {
                key = kv.Key,
                image = kv.Value.Image,
                port = kv.Value.ContainerPort
            }).ToList<object>();
        }
    }
}