using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceManagerService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNullUserFullNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update existing NULL UserFullName values
            migrationBuilder.Sql(@"
                UPDATE ""Tasks"" 
                SET ""UserFullName"" = 'selim' 
                WHERE ""UserId"" = 'ba50dfed-8016-4252-ba95-33f08f98a32e' 
                AND (""UserFullName"" IS NULL OR ""UserFullName"" = '');
                
                UPDATE ""Tasks"" 
                SET ""UserFullName"" = 'melih' 
                WHERE ""UserId"" = '76abf203-3856-4f8c-b0e1-b53f9541cdf5' 
                AND (""UserFullName"" IS NULL OR ""UserFullName"" = '');
                
                -- For any other users with NULL UserFullName, set to 'Unknown User'
                UPDATE ""Tasks"" 
                SET ""UserFullName"" = 'Unknown User' 
                WHERE ""UserFullName"" IS NULL OR ""UserFullName"" = '';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert changes - set back to NULL
            migrationBuilder.Sql(@"
                UPDATE ""Tasks"" 
                SET ""UserFullName"" = NULL 
                WHERE ""UserFullName"" IN ('selim', 'melih', 'Unknown User');
            ");
        }
    }
}
