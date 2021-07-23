using Microsoft.EntityFrameworkCore.Migrations;

namespace WEBAPI.Migrations
{
    public partial class V11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Card");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "CardSet",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "CardSet");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Card",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
