using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using GenericRepository;
using MediatR;
using TS.Result;

namespace EnglishCardApp.Application.Word;

public sealed record DeleteWordCommand(Guid Id) : IRequest<Result<string>>;

internal sealed class DeleteWordCommandHandler(IWordRepository wordRepository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteWordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(DeleteWordCommand request, CancellationToken cancellationToken)
    {
        var word = await wordRepository.FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (word is null)
        {
            return Result<string>.Failure("Kelime bulunamadı!");
        }

        wordRepository.Delete(word);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Succeed("Kelime başarıyla silindi.");
    }
}
