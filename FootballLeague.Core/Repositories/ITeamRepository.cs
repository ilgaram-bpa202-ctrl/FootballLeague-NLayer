using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Repositories
{
    public interface ITeamRepository : IGenericRepository<Team>
    {
        Task<Team> GetSingleTeamWithPlayersAsync(int teamId);

        Task<List<Team>> GetStandingsAsync();
    }
}