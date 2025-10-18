using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Dtos;
using EnglishCardApp.Domain.Entities;
using MediatR;
using TS.Result;

namespace EnglishCardApp.Application.Word;

public sealed record GetWordByIdQuery(Guid Id) : IRequest<Result<WordDto>>;

internal sealed class GetWordByIdQueryHandler(IWordRepository wordRepository)
    : IRequestHandler<GetWordByIdQuery, Result<WordDto>>
{
    public async Task<Result<WordDto>> Handle(GetWordByIdQuery request, CancellationToken cancellationToken)
    {
        var word = await wordRepository.FirstOrDefaultAsync(
            w => w.Id == request.Id,
            cancellationToken
        );

        if (word is null)
        {
            return Result<WordDto>.Failure("Kelime bulunamadı!");
        }

        var wordDto = new WordDto
        {
            Id = word.Id,
            English = word.English,
            Turkish = word.Turkish,
            ExampleSentence = word.ExampleSentence,
            ImageUrl = word.ImageUrl
        };

        return Result<WordDto>.Succeed(wordDto);
    }
}

