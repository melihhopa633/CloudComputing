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
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(builder.Configuration["Serilog:SeqServerUrl"] ?? "http://seq:5341")
    .CreateLogger();

builder.Host.UseSerilog();

// Configure JSON Serialization
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Add Carter for Minimal API
builder.Services.AddCarter();

// Add DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

// Add JWT Service as Singleton
builder.Services.AddSingleton<JwtService>();

// Configure Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = jwtSettings.GetValue<bool>("ValidateIssuerSigningKey"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
        ValidateIssuer = jwtSettings.GetValue<bool>("ValidateIssuer"),
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = jwtSettings.GetValue<bool>("ValidateAudience"),
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = jwtSettings.GetValue<bool>("ValidateLifetime"),
        ClockSkew = TimeSpan.Parse(jwtSettings["ClockSkew"]!)
    };

    options.RequireHttpsMetadata = jwtSettings.GetValue<bool>("RequireHttpsMetadata");
    options.SaveToken = true;
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
