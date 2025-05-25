using System;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

namespace ResourceManagerService.Services
{
    public class MetricsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _prometheusBaseUrl;
        private readonly bool _isDockerEnvironment;

        public MetricsService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            
            // Read configuration or use fallback
            _prometheusBaseUrl = configuration["MetricsService:PrometheusUrl"] ?? "http://prometheus:9090";
            
            // Check if running in Docker environment
            _isDockerEnvironment = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
            
            Console.WriteLine($"Metrics Service initialized. Using Prometheus at: {_prometheusBaseUrl}");
            Console.WriteLine($"Running in Docker: {_isDockerEnvironment}");
        }

        public async Task<string> GetContainerMemoryUsageAsync(string containerId)
        {
            try 
            {
                // Docker stats komutunu kullanarak gerçek zamanlı memory kullanımını al
                var psi = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"stats {containerId} --no-stream --format \"{{{{.MemUsage}}}}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process == null) return "0";

                string output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    Console.WriteLine($"Docker stats failed for container {containerId}");
                    return "0";
                }

                // Output format: "123.4MiB / 2GiB" - sadece kullanılan kısmı al
                var parts = output.Trim().Split('/');
                if (parts.Length > 0)
                {
                    var memUsage = parts[0].Trim();
                    // MiB veya GiB'i MB'a çevir
                    return ConvertToMB(memUsage);
                }

                return "0";
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error getting memory metrics: {ex.Message}");
                return "0";
            }
        }

        public async Task<string> GetContainerCpuUsageAsync(string containerId)
        {
            try 
            {
                // Daha hassas CPU ölçümü için farklı format deneyelim
                var psi = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"stats {containerId} --no-stream --format \"table {{{{.CPUPerc}}}}\\t{{{{.MemUsage}}}}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process == null) 
                {
                    Console.WriteLine($"[MetricsService] Failed to start docker process for {containerId}");
                    return "0";
                }

                string output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    Console.WriteLine($"Docker stats failed for container {containerId}");
                    return "0";
                }

                Console.WriteLine($"[MetricsService] Raw Docker stats output: {output}");

                // Output'u parse et
                var lines = output.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                if (lines.Length >= 2) // Header + data
                {
                    var dataLine = lines[1].Trim();
                    // Tab veya space ile split yap
                    var parts = dataLine.Split(new char[] { '\t', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length >= 1)
                    {
                        var cpuUsage = parts[0].Trim().Replace("%", "");
                        
                        if (double.TryParse(cpuUsage, out double cpuPercent))
                        {
                            Console.WriteLine($"[MetricsService] Parsed CPU: {cpuPercent}% for container {containerId}");
                            
                            // Gerçek değeri döndür, minimum değer verme
                            var result = (cpuPercent / 100.0).ToString("F4");
                            Console.WriteLine($"[MetricsService] Final CPU value: {result}");
                            return result;
                        }
                        else
                        {
                            Console.WriteLine($"[MetricsService] Could not parse CPU value: '{cpuUsage}' for container {containerId}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"[MetricsService] Not enough parts in data line: '{dataLine}' for container {containerId}");
                    }
                }

                Console.WriteLine($"[MetricsService] Could not parse CPU data for {containerId}");
                return "0";
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error getting CPU metrics: {ex.Message}");
                return "0";
            }
        }

        private string ConvertToMB(string memoryString)
        {
            try
            {
                // "123.4MiB" veya "1.2GiB" formatını MB'a çevir
                var numericPart = "";
                var unit = "";
                
                for (int i = 0; i < memoryString.Length; i++)
                {
                    if (char.IsDigit(memoryString[i]) || memoryString[i] == '.')
                    {
                        numericPart += memoryString[i];
                    }
                    else
                    {
                        unit = memoryString.Substring(i);
                        break;
                    }
                }

                if (double.TryParse(numericPart, out double value))
                {
                    switch (unit.ToUpper())
                    {
                        case "MIB":
                            return (value * 1.048576).ToString("F2"); // MiB to MB
                        case "GIB":
                            return (value * 1073.741824).ToString("F2"); // GiB to MB
                        case "KIB":
                            return (value * 0.001048576).ToString("F2"); // KiB to MB
                        case "MB":
                            return value.ToString("F2");
                        case "GB":
                            return (value * 1000).ToString("F2");
                        case "KB":
                            return (value * 0.001).ToString("F2");
                        default:
                            return value.ToString("F2"); // Assume MB
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting memory string '{memoryString}': {ex.Message}");
            }
            
            return "0";
        }

        private async Task<string> QueryPrometheusForValueAsync(string query)
        {
            string url = $"{_prometheusBaseUrl}/api/v1/query?query={Uri.EscapeDataString(query)}";
            Console.WriteLine($"Querying Prometheus: {url}");
            
            var response = await _httpClient.GetStringAsync(url);
            var json = JObject.Parse(response);

            // Response'un başarılı olup olmadığını kontrol et
            if (json["status"]?.ToString() != "success")
            {
                throw new Exception($"Prometheus query failed: {json["error"]?.ToString() ?? "Unknown error"}");
            }

            // Result array'inden ilk sonucu al
            var result = json["data"]?["result"]?.FirstOrDefault();
            if (result == null)
                return "0"; // Sonuç yoksa "0" döndür
            
            // Value array'inden değeri string olarak al [timestamp, value]
            return result["value"]?[1]?.ToString() ?? "0";
        }
    }
} 