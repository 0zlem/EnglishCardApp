using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Domain.Abstractions;

namespace EnglishCardApp.Domain.Entities;

public sealed class User : Entity
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
}
