using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using FluentValidation;
using GenericRepository;
using MediatR;
using TS.Result;

namespace EnglishCardApp.Application.Auth;

public sealed record LoginCommand(string Email, string Password) : IRequest<Result<LoginCommandResponse>>;

public sealed record LoginCommandResponse()
{
    public string AccessToken { get; set; } = default!;
}

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(u => u.Email).EmailAddress().WithMessage("Geçerli bir mail adresi giriniz!");
    }
}

internal sealed class LoginCommandHandler(IUserRepository userRepository, IJwtProvider jwtProvider, IUnitOfWork unitOfWork) : IRequestHandler<LoginCommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user is null)
        {
            return Result<LoginCommandResponse>.Failure("Kullanıcı bulunamadı!");
        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!validPassword)
        {
            return Result<LoginCommandResponse>.Failure("Email veya şifre hatalı!");
        }

        string token = await jwtProvider.CreateTokenAsync(user, request.Password, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        var response = new LoginCommandResponse()
        {
            AccessToken = token
        };

        return Result<LoginCommandResponse>.Succeed(response);
    }
}
