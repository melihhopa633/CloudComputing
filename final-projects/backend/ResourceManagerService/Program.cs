using Microsoft.EntityFrameworkCore;
using ResourceManagerService.Persistence;
using Carter;
using MediatR;
using FluentValidation;
using Serilog;
using Hellang.Middleware.ProblemDetails;
using Npgsql;
using ResourceManagerService.Common;
using ResourceManagerService.Services;

NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

var builder = WebApplication.CreateBuilder(args);

// Serilog konfigürasyonu
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341")
    .CreateLogger();
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCarter();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddProblemDetails(opt =>
{
    opt.IncludeExceptionDetails = (ctx, ex) => builder.Environment.IsDevelopment();
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<DockerService>();
builder.Services.AddHttpClient<MetricsService>();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<UserInfoService>(sp =>
{
    var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
    var identityServiceBaseUrl = "http://localhost:5001"; // Gerekirse appsettings.json'dan alınabilir
    return new UserInfoService(httpClient, identityServiceBaseUrl);
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Apply migrations and seed database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    DbSeeder.Seed(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS - moved before routing
app.UseCors();

// Add routing middleware
app.UseRouting();

// ProblemDetails middleware (global exception + validation response)
app.UseProblemDetails();

// Request/response logging
app.UseSerilogRequestLogging();

// Map endpoints - both controller and Carter endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapCarter();
});

// HTTPS redirection after endpoints
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Global middleware
app.UseApiResponseMiddleware();

app.Run();
