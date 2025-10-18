using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Dtos;
using EnglishCardApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace EnglishCardApp.Application.Word;

public sealed record GetAllWordsQuery() : IRequest<Result<List<WordDto>>>;
internal sealed class GetAllWordsQueryHandler(IWordRepository wordRepository) : IRequestHandler<GetAllWordsQuery, Result<List<WordDto>>>
{
    public async Task<Result<List<WordDto>>> Handle(GetAllWordsQuery request, CancellationToken cancellationToken)
    {
        var words = await wordRepository.GetAll().ToListAsync(cancellationToken);

        var wordDtos = words.Select(w => new WordDto
        {
            Id = w.Id,
            English = w.English,
            Turkish = w.Turkish,
            ExampleSentence = w.ExampleSentence,
            ImageUrl = w.ImageUrl
        }).ToList();

        return Result<List<WordDto>>.Succeed(wordDtos);
    }
}
