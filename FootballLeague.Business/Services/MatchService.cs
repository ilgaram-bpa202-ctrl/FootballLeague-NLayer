using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks;

namespace FootballLeague.Business.Services
{
    public class MatchService : Service<Match>, IMatchService
    {
        private readonly ITeamRepository _teamRepository; // Komandaları çağırmaq üçün

        public MatchService(IGenericRepository<Match> repository, IUnitOfWork unitOfWork, ITeamRepository teamRepository)
            : base(repository, unitOfWork)
        {
            _teamRepository = teamRepository;
        }

        public async Task<Match> AddMatchAndUpdatePointsAsync(Match match)
        {
            // 1. Matçı bazaya əlavə edirik (hələ yadda saxlamırıq)
            await _repository.AddAsync(match);

            // 2. Oynayan komandaları bazadan tapırıq
            var homeTeam = await _teamRepository.GetByIdAsync(match.HomeTeamId);
            var awayTeam = await _teamRepository.GetByIdAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
                throw new Exception("Komandalardan biri və ya hər ikisi tapılmadı!");

            // 3. Ümumi statistikaları artırırıq
            homeTeam.MatchesPlayed++;
            awayTeam.MatchesPlayed++;
            // "?? 0" o deməkdir ki, əgər match.HomeScore null olarsa, onu 0 say.
            homeTeam.GoalsFor += match.HomeScore ?? 0;
            homeTeam.GoalsAgainst += match.AwayScore ?? 0;
            awayTeam.GoalsFor += match.AwayScore ?? 0;
            awayTeam.GoalsAgainst += match.HomeScore ?? 0;

            // 4. Xal hesablama alqoritmi
            if (match.HomeScore > match.AwayScore)
            {
                // Ev sahibi uddu
                homeTeam.Won++;
                homeTeam.Points += 3;
                awayTeam.Lost++;
            }
            else if (match.HomeScore < match.AwayScore)
            {
                // Qonaq uddu
                awayTeam.Won++;
                awayTeam.Points += 3;
                homeTeam.Lost++;
            }
            else
            {
                // Heç-heçə
                homeTeam.Drawn++;
                homeTeam.Points += 1;
                awayTeam.Drawn++;
                awayTeam.Points += 1;
            }

            // 5. Komandaların yeni məlumatlarını yeniləyirik
            _teamRepository.Update(homeTeam);
            _teamRepository.Update(awayTeam);

            // 6. ƏN VACİBİ: Həm matçı, həm də komandaları TƏK BİR SƏFƏRDƏ bazaya yazırıq (UnitOfWork sehri)
            await _unitOfWork.CommitAsync();

            return match;
        }
    }
}