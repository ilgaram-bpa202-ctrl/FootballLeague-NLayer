namespace FootballLeague.Core.DTOs
{
    public class TeamCreateDto
    {
        public string Name { get; set; }
        public string? LogoUrl { get; set; }
        public string? ManagerId { get; set; }
        public int Points { get; set; }
        public int Won { get; set; }
        public int Drawn { get; set; }
        public int Lost { get; set; }
    }
}