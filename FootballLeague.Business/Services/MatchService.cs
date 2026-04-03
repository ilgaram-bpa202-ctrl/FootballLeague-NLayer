using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks;

namespace FootballLeague.Business.Services
{
    public class MatchService : Service<Match>, IMatchService
    {
        private readonly ITeamRepository _teamRepository; 

        public MatchService(IGenericRepository<Match> repository, IUnitOfWork unitOfWork, ITeamRepository teamRepository)
            : base(repository, unitOfWork)
        {
            _teamRepository = teamRepository;
        }

        public async Task<Match> AddMatchAndUpdatePointsAsync(Match match)
        {
            await _repository.AddAsync(match);

            var homeTeam = await _teamRepository.GetByIdAsync(match.HomeTeamId);
            var awayTeam = await _teamRepository.GetByIdAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
                throw new Exception("Komandalardan biri və ya hər ikisi tapılmadı!");

            homeTeam.MatchesPlayed++;
            awayTeam.MatchesPlayed++;
            homeTeam.GoalsFor += match.HomeScore ?? 0;
            homeTeam.GoalsAgainst += match.AwayScore ?? 0;
            awayTeam.GoalsFor += match.AwayScore ?? 0;
            awayTeam.GoalsAgainst += match.HomeScore ?? 0;

            if (match.HomeScore > match.AwayScore)
            {
                homeTeam.Won++;
                homeTeam.Points += 3;
                awayTeam.Lost++;
            }
            else if (match.HomeScore < match.AwayScore)
            {
                awayTeam.Won++;
                awayTeam.Points += 3;
                homeTeam.Lost++;
            }
            else
            {
                homeTeam.Drawn++;
                homeTeam.Points += 1;
                awayTeam.Drawn++;
                awayTeam.Points += 1;
            }

            _teamRepository.Update(homeTeam);
            _teamRepository.Update(awayTeam);

            await _unitOfWork.CommitAsync();

            return match;
        }
    }
}