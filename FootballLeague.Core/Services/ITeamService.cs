using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Services
{
    public interface ITeamService : IService<Team>
    {
        Task<Team> GetSingleTeamWithPlayersAsync(int teamId);
        Task<IEnumerable<Team>> GetStandingsAsync();
    }
}