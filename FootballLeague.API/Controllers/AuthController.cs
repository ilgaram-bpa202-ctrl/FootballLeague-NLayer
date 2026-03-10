using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;

        // IConfiguration bizə appsettings.json-dakı gizli şifrəmizi (Key) oxumaq üçün lazımdır
        public AuthController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // QEYDİYYAT METODU
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Yeni istifadəçi obyekti yaradırıq
            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

            // UserManager şifrəni avtomatik hash-ləyib bazaya yazacaq
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors); // Əgər şifrə çox sadədirsə, xəta qaytaracaq
            }

            return Ok("İstifadəçi uğurla yaradıldı!");
        }

        // GİRİŞ (LOGIN) METODU VƏ TOKEN YARADILMASI
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1. İstifadəçini bazadan tapırıq
            var user = await _userManager.FindByNameAsync(dto.UserName);

            // 2. Əgər istifadəçi varsa və şifrəsi doğrudursa
            if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                // İstifadəçi haqqında kiçik məlumatları (Claim) biletə yazırıq
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                // appsettings.json-dakı möhürümüzü (Key) gətiririk
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                // BİLET (TOKEN) YARADILIR!
                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(3), // 3 saatdan sonra biletin vaxtı bitir
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                // Tokeni müştəriyə (Swagger-ə) geri göndəririk
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }

            return Unauthorized("İstifadəçi adı və ya şifrə yalnışdır!");
        }
    }
}