using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ResourceManagerService.Persistence.Configuration
{
    public class TaskConfiguration : IEntityTypeConfiguration<ResourceManagerService.Entities.Task>
    {
        public void Configure(EntityTypeBuilder<ResourceManagerService.Entities.Task> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.ServiceType).IsRequired().HasMaxLength(100);
            builder.Property(t => t.ContainerId).IsRequired().HasMaxLength(100);
            builder.Property(t => t.Status).IsRequired().HasMaxLength(50);
            builder.Property(t => t.Port).IsRequired();
            builder.Property(t => t.StartTime).IsRequired();
            builder.Property(t => t.UserId).IsRequired();
            
            builder.Property(t => t.Events)
                .HasColumnType("jsonb")
                .HasDefaultValueSql("'[]'::jsonb");
        }
    }
} 