using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WEBAPI.Migrations
{
    public partial class V10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Calendar_CalendarID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_CalendarID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CalendarID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Event");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Event",
                newName: "To");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Event",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Event",
                newName: "From");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Event",
                newName: "Color");

            migrationBuilder.AddColumn<bool>(
                name: "isAdmin",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Note",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserID",
                table: "Event",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_UserID",
                table: "Event",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_User_UserID",
                table: "Event",
                column: "UserID",
                principalTable: "User",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_User_UserID",
                table: "Event");

            migrationBuilder.DropIndex(
                name: "IX_Event_UserID",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "isAdmin",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Note");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Event");

            migrationBuilder.RenameColumn(
                name: "To",
                table: "Event",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Event",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "From",
                table: "Event",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "Color",
                table: "Event",
                newName: "Description");

            migrationBuilder.AddColumn<int>(
                name: "CalendarID",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "Event",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "Event",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateIndex(
                name: "IX_User_CalendarID",
                table: "User",
                column: "CalendarID");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Calendar_CalendarID",
                table: "User",
                column: "CalendarID",
                principalTable: "Calendar",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
