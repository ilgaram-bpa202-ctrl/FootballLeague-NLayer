using System.Numerics;

namespace FootballLeague.Core.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; set; }
        public string LogoUrl { get; set; }
        public string ManagerId { get; set; } // Gələcəkdə meneceri bura bağlayacağıq

        // Xal və statistika sistemi
        public int Points { get; set; } = 0;
        public int Won { get; set; } = 0;
        public int Drawn { get; set; } = 0;
        public int Lost { get; set; } = 0;

        // Bir komandanın çoxlu oyunçusu olar (Baza əlaqəsi)
        public ICollection<Player> Players { get; set; }
    }
}