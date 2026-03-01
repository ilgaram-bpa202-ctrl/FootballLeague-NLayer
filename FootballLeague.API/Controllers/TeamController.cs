using AutoMapper;
using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly IService<Team> _teamService;
        private readonly IMapper _mapper; // AutoMapper-i bura əlavə etdik

        // Constructor: İndi ofisianta həm Aşpazı (Service), həm də Tərcüməçini (Mapper) veririk
        public TeamController(IService<Team> teamService, IMapper mapper)
        {
            _teamService = teamService;
            _mapper = mapper;
        }

        // GET: api/Team
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // 1. Bütün komandaları bazadan (Entity kimi) çəkirik
            var teams = await _teamService.GetAllAsync();

            // 2. Tərcüməçiyə deyirik: "Bu Team siyahısını TeamDto siyahısına çevir"
            // (Artıq müştəri lazımsız məlumatları (Players, CreatedDate) GÖRMƏYƏCƏK!)
            var teamsDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);

            return Ok(teamsDtos);
        }

        // POST: api/Team
        [HttpPost]
        public async Task<IActionResult> Add(TeamCreateDto teamDto)
        {
            // Bayaq alt-alta 10 sətir əllə yazdığımız çevirmə (Mapping) kodunun yerinə sadəcə 1 SƏTİR yazırıq:
            // Tərcüməçiyə deyirik: "Müştəridən gələn DTO-nu əsl Team obyektinə çevir"
            var newTeam = _mapper.Map<Team>(teamDto);

            // Çevrilmiş obyekti bazaya yazırıq
            var addedTeam = await _teamService.AddAsync(newTeam);

            // Bazaya yazılandan sonra geri qaytaranda da DTO kimi qaytarırıq ki, səliqəli olsun
            var addedTeamDto = _mapper.Map<TeamDto>(addedTeam);

            return Created(string.Empty, addedTeamDto);
        }
        // GET: api/Team/5 (Tək bir komandanı ID-yə görə gətirir)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var team = await _teamService.GetByIdAsync(id);
            var teamDto = _mapper.Map<TeamDto>(team);
            return Ok(teamDto);
        }

        // PUT: api/Team (Komandanın məlumatlarını yeniləyir)
        [HttpPut]
        public async Task<IActionResult> Update(TeamDto teamDto)
        {
            // DTO-nu əsl Team obyektinə çeviririk
            var team = _mapper.Map<Team>(teamDto);

            await _teamService.UpdateAsync(team);
            return NoContent(); // 204 status kodu (Uğurludur, amma geri məlumat qaytarmağa ehtiyac yoxdur)
        }

        // DELETE: api/Team/5 (Komandanı silir)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            // Sadəcə id-ni göndəririk ki, get bu nömrəli komandanı sil
            await _teamService.RemoveAsync(id);

            return NoContent(); // 204 status kodu
        }
    }
}