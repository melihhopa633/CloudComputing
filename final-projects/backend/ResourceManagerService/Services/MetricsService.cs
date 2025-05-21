using System;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

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
            try {
                // RAM kullanım ortalaması (1 günlük)
                string query = $"avg_over_time(dockerstats_memory_usage_bytes{{id=\"{containerId}\"}}[1d])";
                return await QueryPrometheusForValueAsync(query);
            }
            catch (Exception ex) {
                Console.WriteLine($"Error getting memory metrics: {ex.Message}");
                return "0";
            }
        }

        public async Task<string> GetContainerCpuUsageAsync(string containerId)
        {
            try {
                // CPU kullanım oranı ortalaması (1 günlük)
                string query = $"avg_over_time(dockerstats_cpu_usage_ratio{{id=\"{containerId}\"}}[1d])";
                return await QueryPrometheusForValueAsync(query);
            }
            catch (Exception ex) {
                Console.WriteLine($"Error getting CPU metrics: {ex.Message}");
                return "0";
            }
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