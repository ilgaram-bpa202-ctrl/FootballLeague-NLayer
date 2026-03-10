using FluentValidation.AspNetCore;
using FootballLeague.API.Middlewares;
using FootballLeague.Business.Services;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks;
using FootballLeague.Core.Validators; // Bunu yuxarıya əlavə et
using FootballLeague.DAL.Context;
using FootballLeague.DAL.Repositories;
using FootballLeague.DAL.UnitOfWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
// ... digər kodlar
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;


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

            // 1. Identity (İstifadəçi) Qeydiyyatı
            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            // 2. JWT Authentication (Token) Qeydiyyatı
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    // appsettings.json-dakı gizli şifrəmizi oxuyuruq:
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            // Bunlar proqrama deyir ki: "Kimsə səndən IGenericRepository və ya IService istəsə, get DAL və Business qatlarındakı uyğun class-ları tapıb ona ver."
            // AddScoped o deməkdir ki, hər yeni istək (request) gələndə yeni bir obyekt yaradılır və işi bitəndə yaddaşdan silinir (performans üçün əladır).
            builder.Services.AddScoped(typeof(FootballLeague.Core.Repositories.IGenericRepository<>), typeof(FootballLeague.DAL.Repositories.GenericRepository<>));
            builder.Services.AddScoped(typeof(FootballLeague.Core.Services.IService<>), typeof(FootballLeague.Business.Services.Service<>));

            // Mövcud olan AddScoped-ların altına əlavə et:
            builder.Services.AddScoped<ITeamRepository, TeamRepository>();
            builder.Services.AddScoped<ITeamService, TeamService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<FootballLeague.Core.Services.IMatchService, FootballLeague.Business.Services.MatchService>();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Add services to the container.

            

            builder.Services.AddControllers()
                .AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<TeamCreateDtoValidator>());

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // AutoMapper-i sistemə əlavə edirik və deyirik ki, "Get mənim yazdığım xəritəni (MapProfile) tap və öyrən"
            builder.Services.AddAutoMapper(typeof(Program));

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
            app.UseCustomException();

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");


            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
