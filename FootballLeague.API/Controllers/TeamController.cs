using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    // [Route] API-nin adresini təyin edir. Məsələn: localhost:1234/api/Team
    [Route("api/[controller]")]
    // [ApiController] bu class-ın sadə bir veb səhifə yox, xüsusi qaydaları olan bir API olduğunu proqrama deyir.
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly IService<Team> _teamService;

        // Constructor: Ofisianta (Controller) Aşpazı (Service) veririk ki, işləyə bilsin.
        public TeamController(IService<Team> teamService)
        {
            _teamService = teamService;
        }

        // GET: api/Team
        [HttpGet] // Müştəri məlumatları GÖRMƏK istəyəndə bu "verb" (feil) işə düşür
        public async Task<IActionResult> GetAll()
        {
            // Aşpaza deyirik: "Bütün komandaları gətir"
            var teams = await _teamService.GetAllAsync();

            // Ok() metodu HTTP 200 (Hər şey qaydasındadır) status kodu ilə məlumatı geri qaytarır
            return Ok(teams);
        }

        // POST: api/Team
        [HttpPost] // Müştəri yeni məlumat ƏLAVƏ ETMƏK istəyəndə bu "verb" işə düşür
        public async Task<IActionResult> Add(Team team)
        {
            // Aşpaza deyirik: "Gələn bu yeni komandanı sistemə əlavə et"
            var newTeam = await _teamService.AddAsync(team);

            // Created() metodu HTTP 201 (Uğurla yaradıldı) status kodu ilə yaradılan obyekti geri qaytarır
            return Created(string.Empty, newTeam);
        }
    }
}