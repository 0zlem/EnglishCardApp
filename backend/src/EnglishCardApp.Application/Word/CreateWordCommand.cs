using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Entities;
using GenericRepository;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace EnglishCardApp.Application.Word.Command;

public sealed record CreateWordCommand(
    string English,
    string Turkish,
    string? ExampleSentence,
    IFormFile? ImageFile
) : IRequest<Result<string>>;



internal sealed class CreateWordCommandHandler(IWordRepository wordRepository, IUnitOfWork unitOfWork) : IRequestHandler<CreateWordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CreateWordCommand request, CancellationToken cancellationToken)
    {
        bool wordExists = await wordRepository.AnyAsync(w => w.English == request.English, cancellationToken);

        if (wordExists)
        {
            return Result<string>.Failure("Kelime zaten mevcut!");
        }

        string imageUrl = string.Empty;
        if (request.ImageFile != null)
        {
            var fileName = Path.GetFileName(request.ImageFile.FileName);
            var savePath = Path.Combine("wwwroot/images", fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);
            using var stream = File.Create(savePath);
            await request.ImageFile.CopyToAsync(stream, cancellationToken);
            imageUrl = "/images/" + fileName;
        }

        Words word = new()
        {
            English = request.English,
            Turkish = request.Turkish,
            ExampleSentence = request.ExampleSentence,
            ImageUrl = imageUrl,
        };

        await wordRepository.AddAsync(word, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Succeed("Kelime başarıyla eklendi.");
    }
}