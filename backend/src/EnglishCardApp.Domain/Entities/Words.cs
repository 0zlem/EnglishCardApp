using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Domain.Abstractions;

namespace EnglishCardApp.Domain.Entities;

public sealed class Words : Entity
{
    public string Turkish { get; set; } = default!;
    public string English { get; set; } = default!;
    public string ExampleSentence { get; set; } = default!;
    public string ImageUrl { get; set; } = string.Empty;
}
