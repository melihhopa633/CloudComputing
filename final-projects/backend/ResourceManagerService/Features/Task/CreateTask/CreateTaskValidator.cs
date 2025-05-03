using FluentValidation;

namespace ResourceManagerService.Features.Task.CreateTask
{
    public class CreateTaskValidator : AbstractValidator<CreateTaskCommand>
    {
        public CreateTaskValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.ServiceType).NotEmpty().MaximumLength(100);
        }
    }
} 