using Microsoft.AspNetCore.Authorization; // Bunu yuxarıya əlavə et
using AutoMapper;
using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // YENİ: Qapıya qıfıl vurduq!
    public class MatchController : ControllerBase
    {
        private readonly IMatchService _matchService;
        private readonly IMapper _mapper;

        public MatchController(IMatchService matchService, IMapper mapper)
        {
            _matchService = matchService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var matches = await _matchService.GetAllAsync();
            var matchesDtos = _mapper.Map<IEnumerable<MatchDto>>(matches);
            return Ok(matchesDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Add(MatchCreateDto matchDto)
        {
            var newMatch = _mapper.Map<Match>(matchDto);

            // Bura dəyişdi! Artıq ağıllı metodumuzu çağırırıq
            var addedMatch = await _matchService.AddMatchAndUpdatePointsAsync(newMatch);

            return Created(string.Empty, _mapper.Map<MatchDto>(addedMatch));
        }
    }
}