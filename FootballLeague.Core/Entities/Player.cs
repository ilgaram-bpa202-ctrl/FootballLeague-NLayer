namespace FootballLeague.Core.Entities
{
    public class Player : BaseEntity
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public int JerseyNumber { get; set; } 

        public int TeamId { get; set; }
        public Team Team { get; set; }
    }
}