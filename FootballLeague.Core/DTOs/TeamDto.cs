namespace FootballLeague.Core.DTOs
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? LogoUrl { get; set; }
        public string? ManagerId { get; set; }
        public int Points { get; set; }
        public int Won { get; set; }
        public int Drawn { get; set; }
        public int Lost { get; set; }
        public List<PlayerDto> Players { get; set; }

        public int MatchesPlayed { get; set; }
        public int GoalsFor { get; set; }      // Vurulan qollar
        public int GoalsAgainst { get; set; }
    }
}