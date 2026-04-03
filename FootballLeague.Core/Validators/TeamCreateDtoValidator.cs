using FluentValidation;
using FootballLeague.Core.DTOs;

namespace FootballLeague.Core.Validators
{
    public class TeamCreateDtoValidator : AbstractValidator<TeamCreateDto>
    {
        public TeamCreateDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Komanda adı boş ola bilməz.")
                .MinimumLength(3).WithMessage("Komanda adı ən az 3 hərfdən ibarət olmalıdır.")
                .MaximumLength(50).WithMessage("Komanda adı 50 hərfdən çox ola bilməz.");

            RuleFor(x => x.Points)
                .GreaterThanOrEqualTo(0).WithMessage("Xal mənfi ola bilməz.");
        }
    }
}