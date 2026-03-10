using FluentValidation.AspNetCore;
using FootballLeague.API.Middlewares;
using FootballLeague.Business.Services;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks;
using FootballLeague.Core.Validators;
using FootballLeague.DAL.Context;
using FootballLeague.DAL.Repositories;
using FootballLeague.DAL.UnitOfWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using System.Text;

namespace FootballLeague.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Baza Əlaqəsi
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection"), sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly("FootballLeague.DAL");
                });
            });

            // Identity Ayarları
            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            // JWT Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            // Dependency Injection (DI)
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));
            builder.Services.AddScoped<ITeamRepository, TeamRepository>();
            builder.Services.AddScoped<ITeamService, TeamService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IMatchService, MatchService>();

            builder.Services.AddEndpointsApiExplorer();

            // --- SWAGGER AYARI (QIRMIZI XƏTƏLƏRİN HƏLLİ BURADADIR) ---
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "FootballLeague API", Version = "v1" });

                // JWT Ayarı - Obyekt yaratmadan birbaşa konfiqurasiya edirik
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            builder.Services.AddControllers()
                .AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<TeamCreateDtoValidator>());

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            // DİQQƏT: Aşağıdakı sətir Swashbuckle ilə toqquşma yarada bilər, hələlik şərhə (comment) alıram
            //builder.Services.AddOpenApi(); 

            builder.Services.AddAutoMapper(typeof(Program));

            var app = builder.Build();

            // Middleware Sıralaması
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                // app.MapOpenApi(); // Bunu da hələlik şərhə alırıq
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