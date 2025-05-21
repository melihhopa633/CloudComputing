using Microsoft.EntityFrameworkCore;
using ResourceManagerService.Entities;
using ResourceManagerService.Persistence.Configuration;

namespace ResourceManagerService.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ResourceManagerService.Entities.Task> Tasks { get; set; }
        public DbSet<ResourceManagerService.Entities.Metrics> Metrics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new TaskConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
} 