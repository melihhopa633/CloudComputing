using Carter;
using IdentityService.Persistence;
using IdentityService.Security;
using IdentityService.Common;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;


var builder = WebApplication.CreateBuilder(args);

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
    new JwtService(builder.Configuration["Jwt:Key"]!));

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
}

// Use Exception Middleware
app.UseMiddleware<ExceptionsMiddleware>();


app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Carter endpoints
app.MapCarter();

app.Run();
