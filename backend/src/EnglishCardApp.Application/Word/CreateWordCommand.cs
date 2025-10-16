using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Entities;
using GenericRepository;
using MediatR;
using TS.Result;

namespace EnglishCardApp.Application.Word.Command;

public sealed record CreateWordCommand(string Turkish, string English, string ExampleSentence, string ImageUrl) : IRequest<Result<string>>;

internal sealed class CreateWordCommandHandler(IWordRepository wordRepository, IUnitOfWork unitOfWork) : IRequestHandler<CreateWordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CreateWordCommand request, CancellationToken cancellationToken)
    {
        bool wordExists = await wordRepository.AnyAsync(w => w.English == request.English, cancellationToken);

        if (wordExists)
        {
            return Result<string>.Failure("Kelime zaten mevcut!");
        }

        Words word = new()
        {
            Turkish = request.Turkish,
            English = request.English,
            ExampleSentence = request.ExampleSentence,
            ImageUrl = request.ImageUrl,
        };

        await wordRepository.AddAsync(word, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Succeed("Kelime başarıyla eklendi.");
    }
}