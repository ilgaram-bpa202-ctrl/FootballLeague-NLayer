namespace FootballLeague.Core.DTOs.News
{
    public class NewsGetDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}