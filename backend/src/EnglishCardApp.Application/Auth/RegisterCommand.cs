using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Entities;
using FluentValidation;
using GenericRepository;
using MediatR;
using TS.Result;

namespace EnglishCardApp.Application.Auth;

public sealed record RegisterCommand(string FirstName, string LastName, string Email, string Password) : IRequest<Result<string>>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(u => u.FirstName).MinimumLength(2).NotEmpty().WithMessage("Ad en az 2 karakter içermelidir!");
        RuleFor(u => u.LastName).MinimumLength(2).NotEmpty().WithMessage("Soyad en az iki karakter içermelidir!");
        RuleFor(u => u.Email).EmailAddress().NotEmpty().WithMessage("Geçerli bir email adresi giriniz!");
        RuleFor(u => u.Password).NotEmpty().MinimumLength(6).WithMessage("Şifre en az 6 karakter içermelidir!");
    }
}

internal sealed class RegisterCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork) : IRequestHandler<RegisterCommand, Result<string>>
{
    public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        bool userExists = await userRepository.AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (userExists)
        {
            return Result<string>.Failure("Kullanıcı zaten mevcut!");
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        User user = new()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = passwordHash
        };

        await userRepository.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Result<string>.Succeed("Kullanıcı başarıyla kaydedildi.");

    }
}
