using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnglishCardApp.Domain.Abstractions;

public class Entity
{
    public Entity()
    {
        Id = Guid.CreateVersion7();
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
