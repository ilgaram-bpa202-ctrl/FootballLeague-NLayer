using FluentValidation;
using FootballLeague.Core.DTOs;

namespace FootballLeague.Core.Validators
{
    public class TeamCreateDtoValidator : AbstractValidator<TeamCreateDto>
    {
        public TeamCreateDtoValidator()
        {
            // Ad boş ola bilməz və ən az 3 simvol olmalıdır
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Komanda adı boş ola bilməz.")
                .MinimumLength(3).WithMessage("Komanda adı ən az 3 hərfdən ibarət olmalıdır.")
                .MaximumLength(50).WithMessage("Komanda adı 50 hərfdən çox ola bilməz.");

            // Xal mənfi ola bilməz (Məsələn, yeni komanda üçün)
            RuleFor(x => x.Points)
                .GreaterThanOrEqualTo(0).WithMessage("Xal mənfi ola bilməz.");
        }
    }
}