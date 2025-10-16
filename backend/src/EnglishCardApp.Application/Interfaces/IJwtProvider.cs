using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Domain.Entities;

namespace EnglishCardApp.Application.Interfaces;

public interface IJwtProvider
{
    public Task<string> CreateTokenAsync(User user, string password, CancellationToken cancellationToken = default!);
}
