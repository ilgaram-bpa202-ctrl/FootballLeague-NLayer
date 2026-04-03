using AutoMapper;
using FootballLeague.Business.Services;
using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService; 
        private readonly IMapper _mapper;

        public TeamController(ITeamService teamService, IMapper mapper)
        {
            _teamService = teamService;
            _mapper = mapper;
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetTeamWithPlayers(int id)
        {
            var team = await _teamService.GetSingleTeamWithPlayersAsync(id);

            if (team == null) throw new Exception($"{id} nömrəli komanda tapılmadı!");

            var teamDto = _mapper.Map<TeamDto>(team);
            return Ok(teamDto);
        }
    
    

        [HttpGet]
        [AllowAnonymous] 
        public async Task<IActionResult> GetAll()
        {
            var teams = await _teamService.GetAllAsync();

            var teamsDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);

            return Ok(teamsDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Add(TeamCreateDto teamDto)
        {
            var newTeam = _mapper.Map<Team>(teamDto);

            var addedTeam = await _teamService.AddAsync(newTeam);

            var addedTeamDto = _mapper.Map<TeamDto>(addedTeam);

            return Created(string.Empty, addedTeamDto);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var team = await _teamService.GetByIdAsync(id);

            if (team == null)
            {
                throw new Exception($"{id} nömrəli komanda bazada tapılmadı!");
            }

            var teamDto = _mapper.Map<TeamDto>(team);
            return Ok(teamDto);
        }

        [HttpPut]
        public async Task<IActionResult> Update(TeamDto teamDto)
        {
            var team = _mapper.Map<Team>(teamDto);

            await _teamService.UpdateAsync(team);
            return NoContent(); 
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var team = await _teamService.GetByIdAsync(id);

            if (team == null)
            {
                throw new Exception($"{id} nömrəli komanda tapılmadığı üçün silinə bilməz!");
            }

            await _teamService.RemoveAsync(id);
            return NoContent();
        }

        [HttpGet("[action]")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetStandings()
        {
            var teams = await _teamService.GetStandingsAsync();

            var standingsDto = _mapper.Map<IEnumerable<TeamDto>>(teams);

            return Ok(standingsDto);
        }
    }
}