using AutoMapper;
using FootballLeague.Core.DTOs;
using FootballLeague.Core.Entities; // (Bayaq səndə Models əvəzinə Entities idi deyə belə yazdım, əgər fərqlidirsə uyğunlaşdırarsan)

namespace FootballLeague.API.Mapping
{
    // Profile class-ı AutoMapper-in xüsusi xəritə class-ıdır
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            // Team obyekti TeamDto-ya çevrilə bilər və ya tərsinə (ReverseMap)
            CreateMap<Team, TeamDto>().ReverseMap();

            // TeamCreateDto obyekti Team-ə çevrilə bilər
            CreateMap<TeamCreateDto, Team>();
        }
    }
}