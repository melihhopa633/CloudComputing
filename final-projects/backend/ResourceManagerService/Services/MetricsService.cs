using System;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace ResourceManagerService.Services
{
    public class MetricsService
    {
        private readonly HttpClient _httpClient;
        private const string PrometheusBaseUrl = "http://localhost:9090";

        public MetricsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetContainerMemoryUsageAsync(string containerId)
        {
            // RAM kullanım ortalaması (1 günlük)
            string query = $"avg_over_time(dockerstats_memory_usage_bytes{{id=\"{containerId}\"}}[1d])";
            return await QueryPrometheusForValueAsync(query);
        }

        public async Task<string> GetContainerCpuUsageAsync(string containerId)
        {
            // CPU kullanım oranı ortalaması (1 günlük)
            string query = $"avg_over_time(dockerstats_cpu_usage_ratio{{id=\"{containerId}\"}}[1d])";
            return await QueryPrometheusForValueAsync(query);
        }

        private async Task<string> QueryPrometheusForValueAsync(string query)
        {
            string url = $"{PrometheusBaseUrl}/api/v1/query?query={Uri.EscapeDataString(query)}";
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