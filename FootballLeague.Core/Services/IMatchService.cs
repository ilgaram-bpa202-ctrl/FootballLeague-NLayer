using FootballLeague.Core.Entities;

namespace FootballLeague.Core.Services
{
    public interface IMatchService : IService<Match>
    {
        // Standart Add metodunun əvəzinə öz xüsusi metodumuzu yaradırıq
        Task<Match> AddMatchAndUpdatePointsAsync(Match match);
    }
}