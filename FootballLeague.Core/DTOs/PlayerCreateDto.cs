namespace FootballLeague.Core.DTOs
{
    public class PlayerCreateDto
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public int JerseyNumber { get; set; }
        public int TeamId { get; set; }
    }
}