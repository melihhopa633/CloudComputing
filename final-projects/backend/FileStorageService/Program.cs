using FileStorageService.Storage;
using Minio;
using MediatR;
using Carter;
using Marten;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddSingleton<MinioClient>(_ => new MinioClient()
    .WithEndpoint("localhost", 9000)
    .WithCredentials("minioadmin", "minioadmin")
    .Build());
builder.Services.AddScoped<IFileStorageService, MinioFileStorageService>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<FileStorageService.Features.UploadFile.UploadFileCommandHandler>());
builder.Services.AddCarter();
builder.Services.AddMarten(options =>
{
    options.Connection(builder.Configuration.GetConnectionString("Marten") ?? "host=localhost;database=filestorage;password=yourpassword;username=youruser");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapCarter();

app.Run();
