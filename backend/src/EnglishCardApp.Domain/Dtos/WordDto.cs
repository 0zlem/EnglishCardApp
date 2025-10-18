using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnglishCardApp.Domain.Dtos;

public class WordDto
{
    public Guid Id { get; set; }
    public string English { get; set; } = default!;
    public string Turkish { get; set; } = default!;
    public string? ExampleSentence { get; set; }
    public string? ImageUrl { get; set; }
}
