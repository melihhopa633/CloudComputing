using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Serilog;

namespace ResourceManagerService.Services
{
    public class UserInfoService
    {
        private readonly HttpClient _httpClient;
        private readonly string _identityServiceBaseUrl;

        public UserInfoService(HttpClient httpClient, string identityServiceBaseUrl)
        {
            _httpClient = httpClient;
            _identityServiceBaseUrl = identityServiceBaseUrl.TrimEnd('/');
        }

        public async Task<(string Email, string FullName)> GetUserInfoAsync(Guid userId)
        {
            var url = $"{_identityServiceBaseUrl}/api/users/{userId}";
            Console.WriteLine($"[UserInfoService] Fetching user info from URL: {url}");
            try
            {
                var response = await _httpClient.GetStringAsync(url);
                Console.WriteLine($"[UserInfoService] Response: {response}");
                var json = JObject.Parse(response);
                var user = json["data"];
                string email = user["email"]?.ToString() ?? string.Empty;
                string fullname = user["username"]?.ToString() ?? user["email"]?.ToString() ?? "Unknown User";
                Console.WriteLine($"[UserInfoService] Parsed - Email: {email}, FullName: {fullname}");
                return (email, fullname);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserInfoService] ERROR: {ex.Message}");
                return ("error", $"ERROR: {ex.Message}");
            }
        }

        public async Task<bool> IsUserAdminAsync(Guid userId)
        {
            try
            {
                var url = $"{_identityServiceBaseUrl}/api/users/{userId}";
                Console.WriteLine($"[UserInfoService] Checking admin status for user {userId} at URL: {url}");
                
                var response = await _httpClient.GetStringAsync(url);
                Console.WriteLine($"[UserInfoService] Response: {response}");
                
                var json = JObject.Parse(response);
                var user = json["data"];
                var userRoles = user["userRoles"] as JArray;
                
                Console.WriteLine($"[UserInfoService] UserRoles count: {userRoles?.Count ?? 0}");
                
                if (userRoles != null)
                {
                    foreach (var userRole in userRoles)
                    {
                        var role = userRole["role"];
                        var roleName = role?["roleName"]?.ToString();
                        Console.WriteLine($"[UserInfoService] Found role: {roleName}");
                        
                        if (string.Equals(roleName, "admin", StringComparison.OrdinalIgnoreCase))
                        {
                            Console.WriteLine($"[UserInfoService] User {userId} is ADMIN");
                            return true;
                        }
                    }
                }
                
                Console.WriteLine($"[UserInfoService] User {userId} is NOT admin");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserInfoService] Error checking admin status for user {userId}: {ex.Message}");
                // Hata durumunda güvenli tarafta kalıp false döndür
                return false;
            }
        }
    }
} 