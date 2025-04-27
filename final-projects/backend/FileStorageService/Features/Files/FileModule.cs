using Carter;
using FileStorageService.Storage;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace FileStorageService.Features.Files
{
    public class FileModule : CarterModule
    {
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/files/upload", async (HttpRequest request, IMediator mediator) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest("Invalid content type");
                var form = await request.ReadFormAsync();
                var file = form.Files[0];
                var bucketName = form["bucketName"].ToString();
                var command = new Features.UploadFile.UploadFileCommand { File = file, BucketName = bucketName };
                var result = await mediator.Send(command);
                return Results.Ok(result);
            });
        }
    }
}
