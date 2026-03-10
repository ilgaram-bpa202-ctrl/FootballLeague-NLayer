using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballLeague.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamStatistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GoalsAgainst",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GoalsFor",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MatchesPlayed",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoalsAgainst",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "GoalsFor",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "MatchesPlayed",
                table: "Teams");
        }
    }
}
