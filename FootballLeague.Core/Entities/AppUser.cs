using Microsoft.AspNetCore.Identity;

namespace FootballLeague.Core.Entities
{
    // IdentityUser klassından miras alırıq. O bizə hazır Id, UserName, Email, PasswordHash kimi sütunlar verəcək!
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}