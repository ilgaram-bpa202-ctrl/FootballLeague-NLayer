using AutoMapper;
using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IService<Player> _playerService;
        private readonly IMapper _mapper;

        public PlayerController(IService<Player> playerService, IMapper mapper)
        {
            _playerService = playerService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var players = await _playerService.GetAllAsync();
            var playersDtos = _mapper.Map<IEnumerable<PlayerDto>>(players);
            return Ok(playersDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Add(PlayerCreateDto playerDto)
        {
            var player = _mapper.Map<Player>(playerDto);
            var addedPlayer = await _playerService.AddAsync(player);
            return Created(string.Empty, _mapper.Map<PlayerDto>(addedPlayer));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _playerService.RemoveAsync(id);
            return NoContent();
        }
    }
}