using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Interfaces;
using EnglishCardApp.Infrastructure.Context;
using EnglishCardApp.Infrastructure.Options;
using EnglishCardApp.Infrastructure.Repositories;
using GenericRepository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Scrutor;

namespace EnglishCardApp.Infrastructure;

public static class InfrastructureRegistrar
{
    public static IServiceCollection AddInfrastructureRegistrar(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(opt =>
        {
            string connection = configuration.GetConnectionString("PostgreSql")!;
            opt.UseNpgsql(connection);
        });

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.ConfigureOptions<JwtOptionsSetup>();

        services.AddScoped<IJwtProvider, JwtProvider>();

        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer();
        services.AddAuthorization();

        services.AddScoped<IUnitOfWork>(srv => srv.GetRequiredService<AppDbContext>());

        services.Scan(opt => opt
        .FromAssemblies(typeof(InfrastructureRegistrar).Assembly)
        .AddClasses(publicOnly: false)
        .UsingRegistrationStrategy(RegistrationStrategy.Skip)
        .AsImplementedInterfaces()
        .WithScopedLifetime());

        return services;
    }
}
