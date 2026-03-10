namespace FootballLeague.Core.DTOs
{
    public class ErrorDto
    {
        public List<string> Errors { get; set; } = new List<string>();
        public int Status { get; set; }

        // Tək bir xəta mesajı üçün köməkçi konstruktorlar
        public ErrorDto(string error, int status)
        {
            Errors.Add(error);
            Status = status;
        }

        public ErrorDto(List<string> errors, int status)
        {
            Errors = errors;
            Status = status;
        }
    }
}