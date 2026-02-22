namespace FootballLeague.Core.Entities
{
    public class Match : BaseEntity
    {
        public int HomeTeamId { get; set; }
        public Team HomeTeam { get; set; }

        public int AwayTeamId { get; set; }
        public Team AwayTeam { get; set; }

        public int? HomeScore { get; set; } // Sual işarəsi (?) yəni oyun hələ başlamayıbsa boş (null) ola bilər
        public int? AwayScore { get; set; }

        public DateTime MatchDate { get; set; }
        public bool IsPlayed { get; set; } = false; // Oyun bitibmi?
    }
}