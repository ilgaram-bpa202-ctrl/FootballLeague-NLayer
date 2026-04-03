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

        public AuthController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var userExists = await _userManager.FindByNameAsync(dto.UserName);
            if (userExists != null)
                return BadRequest("Bu istifadəçi adı artıq məşğuldur!");

            var emailExists = await _userManager.FindByEmailAsync(dto.Email);
            if (emailExists != null)
                return BadRequest("Bu email ünvanı artıq qeydiyyatdan keçib!");

            AppUser user = new AppUser()
            {
                Email = dto.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = dto.UserName,
                FirstName = dto.FirstName,
                LastName = dto.LastName
                
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest($"Qeydiyyat zamanı xəta baş verdi: {errors}");
            }

            await _userManager.AddToRoleAsync(user, "User");

            return StatusCode(201, "Təbriklər! Qeydiyyat uğurla tamamlandı.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(3), // 3 saatdan sonra biletin vaxtı bitir
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }

            return Unauthorized("İstifadəçi adı və ya şifrə yalnışdır!");
        }

        [HttpGet("make-me-admin")]
        public async Task<IActionResult> MakeMeAdmin()
        {
            var roleManager = HttpContext.RequestServices.GetRequiredService<Microsoft.AspNetCore.Identity.RoleManager<Microsoft.AspNetCore.Identity.IdentityRole>>();
            var userManager = HttpContext.RequestServices.GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<FootballLeague.Core.Entities.AppUser>>();


            var user = await userManager.FindByNameAsync("ilqarmm"); 
            if (user == null)
                return NotFound("ilqarmm adlı istifadəçi bazada tapılmadı!");

            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                var result = await userManager.AddToRoleAsync(user, "Admin");
                if (!result.Succeeded)
                    return BadRequest(result.Errors);
            }

            return Ok("TƏBRİKLƏR! 'ilqarmm' artıq rəsmi olaraq Super Admin-dir!");
        }
    }
}