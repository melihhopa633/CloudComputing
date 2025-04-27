using FluentValidation;
using IdentityService.Features.UserRole.CreateUserRole;

namespace IdentityService.Features.UserRole.CreateUserRole
{
    public class CreateUserRoleCommandValidator : AbstractValidator<CreateUserRoleCommand>
    {
        public CreateUserRoleCommandValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required.");
            RuleFor(x => x.RoleId).NotEmpty().WithMessage("RoleId is required.");
        }
    }
}
