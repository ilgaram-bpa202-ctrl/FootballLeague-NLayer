using AutoMapper;
using FootballLeague.Core.DTOs.News;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IService<News> _service;
        private readonly IMapper _mapper;

        public NewsController(IService<News> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var news = await _service.GetAllAsync();
            var newsDtos = _mapper.Map<IEnumerable<NewsGetDto>>(news);
            return Ok(newsDtos); 
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Add(NewsCreateDto newsDto)
        {
            var news = _mapper.Map<News>(newsDto);
            news.CreatedDate = DateTime.Now; 

            await _service.AddAsync(news);
            return StatusCode(201, "Xəbər uğurla əlavə edildi!");
        }

        [HttpPut]
        public async Task<IActionResult> Update(News news)
        {
            await _service.UpdateAsync(news);
            return NoContent();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var newsItem = await _service.GetByIdAsync(id);

            var dto = _mapper.Map<NewsGetDto>(newsItem); 
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Remove(int id)
        {
            await _service.RemoveAsync(id);
            return NoContent(); 
        }
    }
}