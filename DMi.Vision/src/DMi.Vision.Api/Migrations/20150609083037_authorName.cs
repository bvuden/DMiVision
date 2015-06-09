using System.Collections.Generic;
using Microsoft.Data.Entity.Relational.Migrations;
using Microsoft.Data.Entity.Relational.Migrations.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Operations;

namespace DMi.Vision.Api.Migrations
{
    public partial class authorName : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.AddColumn(
                name: "AuthorName",
                table: "Feature",
                type: "nvarchar(max)",
                nullable: true);
        }
        
        public override void Down(MigrationBuilder migration)
        {
            migration.DropColumn(name: "AuthorName", table: "Feature");
        }
    }
}
