
using Microsoft.EntityFrameworkCore;

namespace FootballLeague.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // AppDbContext-i servislərə əlavə edirik
            builder.Services.AddDbContext<FootballLeague.DAL.Context.AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection"), sqlOptions =>
                {
                    // Əgər Migration-ların API qatında deyil, DAL qatında yaranmasını istəyiriksə bunu bildirməliyik:
                    sqlOptions.MigrationsAssembly("FootballLeague.DAL");
                });
            });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
