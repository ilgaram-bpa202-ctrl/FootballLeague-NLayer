
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

            // Bunlar proqrama deyir ki: "Kimsə səndən IGenericRepository və ya IService istəsə, get DAL və Business qatlarındakı uyğun class-ları tapıb ona ver."
            // AddScoped o deməkdir ki, hər yeni istək (request) gələndə yeni bir obyekt yaradılır və işi bitəndə yaddaşdan silinir (performans üçün əladır).
            builder.Services.AddScoped(typeof(FootballLeague.Core.Repositories.IGenericRepository<>), typeof(FootballLeague.DAL.Repositories.GenericRepository<>));
            builder.Services.AddScoped(typeof(FootballLeague.Core.Services.IService<>), typeof(FootballLeague.Business.Services.Service<>));


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

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
