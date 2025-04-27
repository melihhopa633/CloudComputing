using IdentityService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IdentityService.Persistence.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.HasKey(r => r.Id);
            builder.HasIndex(r => r.RoleName).IsUnique();
            builder.Property(r => r.RoleName).IsRequired().HasMaxLength(100);
            builder.HasMany<UserRole>().WithOne(ur => ur.Role).HasForeignKey(ur => ur.RoleId);
        }
    }
}
