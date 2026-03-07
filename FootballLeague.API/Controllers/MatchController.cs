using AutoMapper;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

[Route("api/[controller]")]
[ApiController]
public class MatchController : ControllerBase
{
    private readonly IService<Match> _matchService;
    private readonly IMapper _mapper;

    public MatchController(IService<Match> matchService, IMapper mapper)
    {
        _matchService = matchService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var matches = await _matchService.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<MatchDto>>(matches));
    }

    [HttpPost]
    public async Task<IActionResult> Add(MatchCreateDto dto)
    {
        var match = _mapper.Map<Match>(dto);
        await _matchService.AddAsync(match);
        return Ok(_mapper.Map<MatchDto>(match));
    }
}