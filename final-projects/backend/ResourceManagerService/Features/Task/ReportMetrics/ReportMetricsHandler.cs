using MediatR;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence;
using ResourceManagerService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;
using Serilog;

namespace ResourceManagerService.Features.Task.ReportMetrics
{
    public class ReportMetricsHandler : IRequestHandler<ReportMetricsCommand, bool>
    {
        private readonly AppDbContext _dbContext;
        private readonly MetricsService _metricsService;
        private readonly UserInfoService _userInfoService;
        private readonly HttpClient _httpClient;
        private readonly string _blockchainServiceBaseUrl = "http://localhost:4002";
        public ReportMetricsHandler(AppDbContext dbContext, MetricsService metricsService, UserInfoService userInfoService, HttpClient httpClient)
        {
            _dbContext = dbContext;
            _metricsService = metricsService;
            _userInfoService = userInfoService;
            _httpClient = httpClient;
        }

        public async Task<bool> Handle(ReportMetricsCommand request, CancellationToken cancellationToken)
        {
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) return false;

            // Container'ın RAM ve CPU kullanımını ölç
            string memoryUsage = "0";
            string cpuUsage = "0";
            try
            {
                if (!string.IsNullOrWhiteSpace(task.ContainerId))
                {
                    memoryUsage = await _metricsService.GetContainerMemoryUsageAsync(task.ContainerId);
                    if (memoryUsage.Contains('.'))
                        memoryUsage = memoryUsage.Substring(0, memoryUsage.IndexOf('.'));
                    cpuUsage = await _metricsService.GetContainerCpuUsageAsync(task.ContainerId);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[ReportMetricsHandler] Container metrics read error for TaskId {TaskId}", task.Id);
                memoryUsage = "-1";
                cpuUsage = "-1";
            }

            // RAM'i MB'a çevir
            string memoryMB = "-1";
            if (double.TryParse(memoryUsage, out double memBytes) && memBytes >= 0)
            {
                memoryMB = (memBytes / (1024 * 1024)).ToString("F2");
            }

            // Kullanıcı bilgisi çek
            string userEmail = string.Empty;
            string userFullName = string.Empty;
            try
            {
                var userInfo = await _userInfoService.GetUserInfoAsync(task.UserId);
                userEmail = userInfo.Email;
                userFullName = userInfo.FullName;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[ReportMetricsHandler] User info fetch error for UserId {UserId}", task.UserId);
                userEmail = "unknown";
                userFullName = "unknown";
            }

            // Blockchain backend'e veri gönder
            try
            {
                var metricObj = new
                {
                    user_email = userEmail,
                    user_fullname = userFullName,
                    containerId = task.ContainerId,
                    containerName = task.ServiceType,
                    memoryMB = memoryMB,
                    cpuUsage = cpuUsage
                };
                var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(metricObj), System.Text.Encoding.UTF8, "application/json");
                var resp = await _httpClient.PostAsync($"{_blockchainServiceBaseUrl}/api/metrics", content);
                resp.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[ReportMetricsHandler] Blockchain metrics post error for TaskId {TaskId}", task.Id);
                // Blockchain'e yazılamadı, logla ama işlemi bozma
            }

            return true;
        }
    }
} 