using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace FootballLeague.DAL.Repositories
{
    public class TeamRepository : GenericRepository<Team>, ITeamRepository
    {
        private readonly AppDbContext _context;

        public TeamRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Team> GetSingleTeamWithPlayersAsync(int teamId)
        {
            // .Include(x => x.Players) hissəsi oyunçuları komanda ilə birləşdirir
            return await _context.Teams
                .Include(x => x.Players)
                .FirstOrDefaultAsync(x => x.Id == teamId);
        }

        public async Task<List<Team>> GetStandingsAsync()
        {
            // Futbol kurallarına göre sıralama: Puan -> Averaj -> Atılan Gol
            return await _context.Teams
                .OrderByDescending(t => t.Points)
                .ThenByDescending(t => t.GoalsFor - t.GoalsAgainst)
                .ThenByDescending(t => t.GoalsFor)
                .ToListAsync();
        }
    }
}