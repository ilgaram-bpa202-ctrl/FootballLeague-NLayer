using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Services
{
    public interface ITeamService : IService<Team>
    {
        Task<Team> GetSingleTeamWithPlayersAsync(int teamId);
        // GetSingleTeamWithPlayersAsync metodunun hemen altına:
        Task<IEnumerable<Team>> GetStandingsAsync();
    }
}