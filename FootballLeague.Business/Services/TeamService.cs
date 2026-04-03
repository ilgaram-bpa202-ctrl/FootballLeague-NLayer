using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks; 

namespace FootballLeague.Business.Services
{
    public class TeamService : Service<Team>, ITeamService
    {
        private readonly ITeamRepository _teamRepository;

        public TeamService(IGenericRepository<Team> repository, IUnitOfWork unitOfWork, ITeamRepository teamRepository)
    : base(repository, unitOfWork)
        {
            _teamRepository = teamRepository;
        }

        public async Task<Team> GetSingleTeamWithPlayersAsync(int teamId)
        {
            return await _teamRepository.GetSingleTeamWithPlayersAsync(teamId);
        }

        public async Task<IEnumerable<Team>> GetStandingsAsync()
        {
            return await _teamRepository.GetStandingsAsync();
        }
    }
}