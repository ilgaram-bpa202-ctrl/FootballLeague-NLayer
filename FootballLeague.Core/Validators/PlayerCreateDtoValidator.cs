using FluentValidation;
using FootballLeague.Core.DTOs;

namespace FootballLeague.Core.Validators
{
    public class PlayerCreateDtoValidator : AbstractValidator<PlayerCreateDto>
    {
        public PlayerCreateDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Oyunçunun adı boş ola bilməz.");
            RuleFor(x => x.Position).NotEmpty().WithMessage("Mövqe (Position) qeyd edilməlidir.");
            RuleFor(x => x.JerseyNumber)
                .InclusiveBetween(1, 99).WithMessage("Forma nömrəsi 1 ilə 99 arasında olmalıdır.");
            RuleFor(x => x.TeamId).GreaterThan(0).WithMessage("Oyunçunun bir komandası olmalıdır.");
        }
    }
}