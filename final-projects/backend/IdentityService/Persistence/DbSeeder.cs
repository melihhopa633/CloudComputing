using System;
using System.Linq;
using IdentityService.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Persistence
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Seed Roles
            if (!context.Roles.Any())
            {
                var adminRole = new Role { Id = Guid.NewGuid(), RoleName = "Admin" };
                var userRole = new Role { Id = Guid.NewGuid(), RoleName = "User" };
                context.Roles.AddRange(adminRole, userRole);
                context.SaveChanges();
            }

            // Seed Users
            if (!context.Users.Any())
            {
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    CreatedAt = DateTime.UtcNow,
                    UserRoles = new List<UserRole>()
                };
                context.Users.Add(admin);
                context.SaveChanges();

                // Assign Admin role to admin user
                var adminRole = context.Roles.First(r => r.RoleName == "Admin");
                var userRole = new UserRole
                {
                    Id = Guid.NewGuid(),
                    UserId = admin.Id,
                    RoleId = adminRole.Id,
                    User = admin,
                    Role = adminRole
                };
                context.UserRoles.Add(userRole);
                context.SaveChanges();
            }
        }
    }
}
