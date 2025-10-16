using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Domain.Entities;
using EnglishCardApp.Infrastructure.Context;
using GenericRepository;

namespace EnglishCardApp.Infrastructure.Repositories;

internal sealed class WordRepository : Repository<Words, AppDbContext>, IWordRepository
{
    public WordRepository(AppDbContext context) : base(context)
    {
    }
}
