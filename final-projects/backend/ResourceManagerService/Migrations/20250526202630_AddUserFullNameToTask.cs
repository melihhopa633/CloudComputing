﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceManagerService.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFullNameToTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserFullName",
                table: "Tasks",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserFullName",
                table: "Tasks");
        }
    }
}
