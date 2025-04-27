namespace IdentityService.Common
{
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public object? Data { get; set; }

        public static ApiResponse SuccessResponse(string message, object? data = null) => new ApiResponse { Success = true, Message = message, Data = data };
        public static ApiResponse Fail(string message) => new ApiResponse { Success = false, Message = message };
    }
}
