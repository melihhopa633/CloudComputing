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
                "jupyter", new DockerServiceConfig
                {
                    Image = "jupyter/base-notebook", ContainerPort = 8888,
                    ExtraArgs = "start-notebook.sh --NotebookApp.token=''"
                }
            },

            {
                "filebrowser", new DockerServiceConfig
                {
                    Image = "filebrowser/filebrowser", ContainerPort = 80
                }
            },

            {
                "theia", new DockerServiceConfig
                {
                    Image = "elswork/theia", ContainerPort = 3000
                }
            },

            {
                "drawio", new DockerServiceConfig
                {
                    Image = "fjudith/draw.io", ContainerPort = 8080
                }
            },

            {
                "excalidraw", new DockerServiceConfig
                {
                    Image = "excalidraw/excalidraw", ContainerPort = 80
                }
            },

            {
                "photopea", new DockerServiceConfig
                {
                    Image = "kovaszab/photopea", ContainerPort = 8887
                }
            },

            {
                "adminer", new DockerServiceConfig
                {
                    Image = "adminer", ContainerPort = 8080
                }
            },

            {
                "directus", new DockerServiceConfig
                {
                    Image = "directus/directus", ContainerPort = 8055,
                    Environment = new()
                    {
                        { "ADMIN_EMAIL", "admin@example.com" },
                        { "ADMIN_PASSWORD", "admin123" },
                        { "KEY", "supersecretkey" },
                        { "SECRET", "supersecretsecret" }
                    }
                }
            },
            // ✅ JSON düzenleyici ve test sayfası (frontend-dev için müthiş)
            {
                "jsoneditor", new DockerServiceConfig
                {
                    Image = "djmattyg007/jsoneditor", ContainerPort = 80
                }
            },
            // ✅ Markdown not alma / paylaşma uygulaması (Notion alternatifi)
            { "trilium", new DockerServiceConfig {
                Image = "zadam/trilium", ContainerPort = 8080 }
            },
            // ✅ Snapdrop: Cihazlar arası dosya paylaşımı
            {
                "snapdrop", new DockerServiceConfig
                {
                    Image = "linuxserver/snapdrop", ContainerPort = 80
                }
            }
        };


        public async Task<(string containerId, int hostPort)> StartContainerAsync(string serviceType)
        {
            if (!ServiceMap.TryGetValue(serviceType, out var config))
                throw new KeyNotFoundException($"Unknown serviceType: {serviceType}");

            string image = config.Image;
            int containerPort = config.ContainerPort;
            int hostPort = GetAvailablePort(10000, 60000);

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
            string containerId = await process.StandardOutput.ReadLineAsync() ?? string.Empty;
            await process.WaitForExitAsync();

            if (string.IsNullOrWhiteSpace(containerId) || process.ExitCode != 0)
            {
                string errorOutput = await process.StandardError.ReadToEndAsync();
                throw new Exception($"❌ Docker run failed: {errorOutput}");
            }

            return (containerId.Trim(), hostPort);
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
    }
}