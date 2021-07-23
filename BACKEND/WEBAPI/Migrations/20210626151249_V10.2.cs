using Microsoft.EntityFrameworkCore.Migrations;

namespace WEBAPI.Migrations
{
    public partial class V102 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Calendar_CalendarID",
                table: "Event");

            migrationBuilder.DropTable(
                name: "Calendar");

            migrationBuilder.DropIndex(
                name: "IX_Event_CalendarID",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CalendarID",
                table: "Event");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CalendarID",
                table: "Event",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Calendar",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calendar", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_CalendarID",
                table: "Event",
                column: "CalendarID");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Calendar_CalendarID",
                table: "Event",
                column: "CalendarID",
                principalTable: "Calendar",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
