using System.Numerics;

namespace FootballLeague.Core.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; set; }
        public string LogoUrl { get; set; }
        public string ManagerId { get; set; } 

        public int Points { get; set; } = 0;
        public int Won { get; set; } = 0;
        public int Drawn { get; set; } = 0;
        public int Lost { get; set; } = 0;

        public ICollection<Player> Players { get; set; }

        public int MatchesPlayed { get; set; }
        public int GoalsFor { get; set; }    
        public int GoalsAgainst { get; set; }
    }
}