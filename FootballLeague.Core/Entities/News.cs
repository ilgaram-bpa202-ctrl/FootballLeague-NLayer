namespace FootballLeague.Core.Entities
{
    public class News : BaseEntity // BaseEntity-də Id və s. varsa
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}