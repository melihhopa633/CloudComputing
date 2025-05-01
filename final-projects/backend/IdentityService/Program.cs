using Carter;
using IdentityService.Persistence;
using IdentityService.Security;
using IdentityService.Common;
using IdentityService.Features.Auth;
using IdentityService.Features.Auth.Login;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(builder.Configuration["Serilog:SeqServerUrl"] ?? "http://seq:5341")
    .CreateLogger();

builder.Host.UseSerilog();

// Add Carter for Minimal API
builder.Services.AddCarter();

// Add DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

// Add JWT Service
builder.Services.AddSingleton<JwtService>(sp =>
    new JwtService(
        builder.Configuration["Jwt:Key"]!,
        builder.Configuration["Jwt:Issuer"]!,
        builder.Configuration["Jwt:Audience"]!,
        int.Parse(builder.Configuration["Jwt:ExpireHours"] ?? "2"),
        7 // Refresh token expires in 7 days
    ));

// Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddAuthorization();

// Add MediatR for CQRS
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

var app = builder.Build();

// Apply migrations at startup
MigrationManager.ApplyMigrations(app);

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(dbContext);
    Log.Information("Database seeded successfully");
}

// Use Exception Middleware
app.UseMiddleware<ExceptionsMiddleware>();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Add Serilog request logging
app.UseSerilogRequestLogging();

// Carter endpoints
app.MapCarter();

try
{
    Log.Information("Starting IdentityService");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
