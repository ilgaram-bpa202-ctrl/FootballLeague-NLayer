using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Repositories
{
    public interface ITeamRepository : IGenericRepository<Team>
    {
        // Xüsusi metod: Komandanı ID-yə görə gətir və içindəki Players siyahısını doldur
        Task<Team> GetSingleTeamWithPlayersAsync(int teamId);

        Task<List<Team>> GetStandingsAsync();
    }
}