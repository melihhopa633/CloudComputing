using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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
            var response = await _httpClient.GetStringAsync(url);
            var json = JObject.Parse(response);
            var user = json["data"];
            string email = user["email"]?.ToString() ?? string.Empty;
            string fullname = user["fullName"]?.ToString() ?? string.Empty;
            return (email, fullname);
        }
    }
} 