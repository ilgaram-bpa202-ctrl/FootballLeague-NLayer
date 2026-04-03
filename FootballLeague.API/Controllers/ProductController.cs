using AutoMapper;
using FootballLeague.Core.DTOs.Products;
using FootballLeague.Core.Entities;
using FootballLeague.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballLeague.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IService<Product> _service;
        private readonly IMapper _mapper;

        public ProductController(IService<Product> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var products = await _service.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<ProductGetDto>>(products);
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add(ProductCreateDto dto)
        {
            var product = _mapper.Map<Product>(dto);
            await _service.AddAsync(product);
            return StatusCode(201, "Məhsul uğurla mağazaya əlavə edildi!");
        }

        [HttpPut]
        public async Task<IActionResult> Update(Product product)
        {
            await _service.UpdateAsync(product);
            return NoContent();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id); 
            if (product == null)
                return NotFound("Axtardığınız məlumat tapılmadı!");

            var dto = _mapper.Map<ProductGetDto>(product);
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Remove(int id)
        {
            await _service.RemoveAsync(id);
            return Ok("Məlumat uğurla bazadan silindi!");
        }
    }
}