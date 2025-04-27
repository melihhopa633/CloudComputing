namespace IdentityService.Features.Roles
{
    public class AssignRoleCommand
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
