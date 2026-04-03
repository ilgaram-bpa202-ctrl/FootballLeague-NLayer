using System.ComponentModel.DataAnnotations.Schema;

namespace FootballLeague.Core.Entities
{
    public class Product : BaseEntity 
    {
        public string Name { get; set; } = null!; 
        public string Description { get; set; } = null!; 

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; } 
        public string? ImageUrl { get; set; } 
        public int StockQuantity { get; set; } 
    }
}