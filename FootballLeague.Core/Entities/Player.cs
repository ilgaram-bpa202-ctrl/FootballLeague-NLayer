namespace FootballLeague.Core.Entities
{
    public class Player : BaseEntity
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public int JerseyNumber { get; set; } // Forma nömrəsi

        // Oyunçu 1 komandaya məxsusdur (Baza əlaqəsi)
        public int TeamId { get; set; }
        public Team Team { get; set; }
    }
}