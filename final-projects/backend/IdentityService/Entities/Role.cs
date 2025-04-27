using System;
using System.Collections.Generic;

namespace IdentityService.Entities
{
    public class Role
    {
        public Guid Id { get; set; } // Use Guid for PK as per spec
        public required string RoleName { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
