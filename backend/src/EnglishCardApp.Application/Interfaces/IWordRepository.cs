using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Domain.Entities;
using GenericRepository;

namespace EnglishCardApp.Application.Interfaces;

public interface IWordRepository : IRepository<Words>
{

}
