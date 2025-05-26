using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceManagerService.Migrations
{
    /// <inheritdoc />
    public partial class ReorderUserFullNameColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Sütun sırasını düzeltmek için tabloyu yeniden oluştur
            migrationBuilder.Sql(@"
                -- Geçici tablo oluştur
                CREATE TABLE Tasks_temp AS SELECT * FROM ""Tasks"";
                
                -- Eski tabloyu sil
                DROP TABLE ""Tasks"";
                
                -- Yeni tabloyu doğru sütun sırası ile oluştur
                CREATE TABLE ""Tasks"" (
                    ""Id"" uuid NOT NULL,
                    ""UserId"" uuid NOT NULL,
                    ""UserFullName"" character varying(200),
                    ""ServiceType"" character varying(100) NOT NULL,
                    ""ContainerId"" character varying(100) NOT NULL,
                    ""Port"" integer NOT NULL,
                    ""StartTime"" timestamp with time zone NOT NULL,
                    ""StopTime"" timestamp with time zone,
                    ""Duration"" interval,
                    ""Status"" character varying(50) NOT NULL,
                    ""Events"" jsonb NOT NULL DEFAULT '[]'::jsonb,
                    CONSTRAINT ""PK_Tasks"" PRIMARY KEY (""Id"")
                );
                
                -- Verileri geri kopyala
                INSERT INTO ""Tasks"" SELECT 
                    ""Id"", ""UserId"", ""UserFullName"", ""ServiceType"", ""ContainerId"", 
                    ""Port"", ""StartTime"", ""StopTime"", ""Duration"", ""Status"", ""Events""
                FROM Tasks_temp;
                
                -- Geçici tabloyu sil
                DROP TABLE Tasks_temp;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Geri alma işlemi - sütun sırasını eski haline getir
            migrationBuilder.Sql(@"
                -- Geçici tablo oluştur
                CREATE TABLE Tasks_temp AS SELECT * FROM ""Tasks"";
                
                -- Eski tabloyu sil
                DROP TABLE ""Tasks"";
                
                -- Eski sütun sırası ile tabloyu oluştur
                CREATE TABLE ""Tasks"" (
                    ""Id"" uuid NOT NULL,
                    ""UserId"" uuid NOT NULL,
                    ""ServiceType"" character varying(100) NOT NULL,
                    ""ContainerId"" character varying(100) NOT NULL,
                    ""Port"" integer NOT NULL,
                    ""StartTime"" timestamp with time zone NOT NULL,
                    ""StopTime"" timestamp with time zone,
                    ""Duration"" interval,
                    ""Status"" character varying(50) NOT NULL,
                    ""Events"" jsonb NOT NULL DEFAULT '[]'::jsonb,
                    ""UserFullName"" character varying(200),
                    CONSTRAINT ""PK_Tasks"" PRIMARY KEY (""Id"")
                );
                
                -- Verileri geri kopyala
                INSERT INTO ""Tasks"" SELECT 
                    ""Id"", ""UserId"", ""ServiceType"", ""ContainerId"", ""Port"", 
                    ""StartTime"", ""StopTime"", ""Duration"", ""Status"", ""Events"", ""UserFullName""
                FROM Tasks_temp;
                
                -- Geçici tabloyu sil
                DROP TABLE Tasks_temp;
            ");
        }
    }
}
