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
        private readonly string _blockchainServiceBaseUrl = "http://blockchainservice:4002";
        public ReportMetricsHandler(AppDbContext dbContext, MetricsService metricsService, UserInfoService userInfoService, HttpClient httpClient)
        {
            _dbContext = dbContext;
            _metricsService = metricsService;
            _userInfoService = userInfoService;
            _httpClient = httpClient;
        }

        public async Task<bool> Handle(ReportMetricsCommand request, CancellationToken cancellationToken)
        {
            Console.WriteLine($"[ReportMetricsHandler] Starting metrics report for TaskId {request.Id}");
            
            var task = await _dbContext.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);
            if (task == null) 
            {
                Console.WriteLine($"[ReportMetricsHandler] Task not found for TaskId {request.Id}");
                return false;
            }

            Console.WriteLine($"[ReportMetricsHandler] Found task for UserId {task.UserId}");

            // Admin kullanıcıları için metrics kaydetme
            bool isAdmin = false;
            try
            {
                Console.WriteLine($"[ReportMetricsHandler] Checking if user {task.UserId} is admin...");
                isAdmin = await _userInfoService.IsUserAdminAsync(task.UserId);
                Console.WriteLine($"[ReportMetricsHandler] Admin check result: {isAdmin}");
                
                if (isAdmin)
                {
                    Console.WriteLine($"[ReportMetricsHandler] User {task.UserId} is admin, skipping metrics recording for TaskId {task.Id}");
                    return true; // Admin için başarılı döndür ama metrics kaydetme
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ReportMetricsHandler] Admin check EXCEPTION for UserId {task.UserId}: {ex.Message}");
                Log.Error(ex, "[ReportMetricsHandler] Admin check error for UserId {UserId}", task.UserId);
                // Hata durumunda güvenli tarafta kalıp metrics kaydetme
                return true;
            }

            Console.WriteLine($"[ReportMetricsHandler] User {task.UserId} is not admin, proceeding with metrics recording for TaskId {task.Id}");

            // Container'ın RAM ve CPU kullanımını ölç
            string memoryUsage = "0";
            string cpuUsage = "0";
            try
            {
                if (!string.IsNullOrWhiteSpace(task.ContainerId))
                {
                    memoryUsage = await _metricsService.GetContainerMemoryUsageAsync(task.ContainerId);
                    cpuUsage = await _metricsService.GetContainerCpuUsageAsync(task.ContainerId);
                    
                    Console.WriteLine($"[ReportMetricsHandler] Container {task.ContainerId}: Memory={memoryUsage}MB, CPU={cpuUsage}");
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[ReportMetricsHandler] Container metrics read error for TaskId {TaskId}", task.Id);
                memoryUsage = "-1";
                cpuUsage = "-1";
            }

            // MetricsService zaten MB ve decimal format döndürüyor, ekstra dönüştürme yapmaya gerek yok
            string memoryMB = memoryUsage;
            
            // CPU usage zaten decimal format (0.1234 gibi)

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

            // Metrics'i kendi veritabanına hemen kaydet
            try
            {
                var metrics = new Entities.Metrics
                {
                    UserEmail = userEmail,
                    UserFullName = userFullName,
                    ContainerId = task.ContainerId,
                    ContainerName = task.ServiceType,
                    MemoryMB = memoryMB,
                    CpuUsage = cpuUsage,
                    CreatedAt = DateTime.UtcNow
                };
                _dbContext.Metrics.Add(metrics);
                await _dbContext.SaveChangesAsync(cancellationToken);
                
                Console.WriteLine($"[ReportMetricsHandler] Metrics saved to local DB for TaskId {task.Id}");
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[ReportMetricsHandler] Metrics DB insert error for TaskId {TaskId}", task.Id);
            }

            // Blockchain işlemini asenkron başlat (response'u bekletmez)
            _ = System.Threading.Tasks.Task.Run(async () =>
            {
                try
                {
                    Console.WriteLine($"[ReportMetricsHandler] Starting async blockchain operation for TaskId {task.Id}");
                    
                    var metricObj = new
                    {
                        user_email = userEmail,
                        user_fullname = userFullName,
                        containerId = task.ContainerId,
                        containerName = task.ServiceType,
                        memoryMB = memoryMB,
                        cpuUsage = cpuUsage
                    };
                    
                    // Yeni HttpClient oluştur (dispose edilmiş olanı kullanma)
                    using var httpClient = new HttpClient();
                    var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(metricObj), System.Text.Encoding.UTF8, "application/json");
                    var resp = await httpClient.PostAsync($"{_blockchainServiceBaseUrl}/api/metrics", content);
                    resp.EnsureSuccessStatusCode();
                    
                    Console.WriteLine($"[ReportMetricsHandler] Blockchain operation completed for TaskId {task.Id}");
                    
                    // 🧾 OTOMATIK FATURALAMA TETİKLEYİCİSİ - Task bittiğinde anlık fatura hesabı
                    try
                    {
                        Console.WriteLine($"[ReportMetricsHandler] Triggering automatic billing calculation for user {userEmail}");
                        
                        var billingObj = new
                        {
                            user_email = userEmail,
                            start_date = DateTime.UtcNow.AddDays(-30).ToString("yyyy-MM-ddTHH:mm:ss"), // Son 30 gün
                            end_date = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")
                        };
                        
                        var billingContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(billingObj), System.Text.Encoding.UTF8, "application/json");
                        var billingResp = await httpClient.PostAsync("http://billingservice:5003/api/billing/calculate", billingContent);
                        
                        if (billingResp.IsSuccessStatusCode)
                        {
                            var billingResult = await billingResp.Content.ReadAsStringAsync();
                            Console.WriteLine($"[ReportMetricsHandler] ✅ Billing calculation completed for {userEmail}: {billingResult}");
                        }
                        else
                        {
                            Console.WriteLine($"[ReportMetricsHandler] ⚠️ Billing calculation failed for {userEmail}: {billingResp.StatusCode}");
                        }
                    }
                    catch (Exception billingEx)
                    {
                        Console.WriteLine($"[ReportMetricsHandler] ⚠️ Billing calculation error for {userEmail}: {billingEx.Message}");
                        // Billing hatası blockchain işlemini etkilemez
                    }
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "[ReportMetricsHandler] Async blockchain metrics post error for TaskId {TaskId}", task.Id);
                }
            });

            // Hemen true döndür (modal kapanabilir)
            Console.WriteLine($"[ReportMetricsHandler] Returning success immediately for TaskId {task.Id}");
            return true;
        }
    }
} 