using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Services
{
    public interface IMatchService : IService<Match>
    {
        Task<Match> AddMatchAndUpdatePointsAsync(Match match);
    }
}