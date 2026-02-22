using FootballLeague.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FootballLeague.DAL.Context
{
    public class AppDbContext : DbContext
    {
        // Bu konstruktor API qatından baza ayarlarını (məsələn, SQL şifrəsini) bura göndərmək üçündür
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Cədvəllərimizi bura əlavə edirik (DbSet)
        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }

        // Bəzi xüsusi baza qaydalarını burada yazırıq
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ÇOX VACİB: Match cədvəlində 2 dənə Team olduğu üçün SQL Server "Multiple Cascade Paths" xətası verir.
            // Bunun qarşısını almaq üçün deyirik ki, Komanda silinəndə Oyunlar avtomatik silinməsin (Restrict).

            modelBuilder.Entity<Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}