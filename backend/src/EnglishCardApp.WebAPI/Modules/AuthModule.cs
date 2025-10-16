using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Auth;
using MediatR;
using TS.Result;

namespace EnglishCardApp.WebAPI.Modules;

public static class AuthModule
{
    public static void RegisterAuthRoutes(this IEndpointRouteBuilder app)
    {
        RouteGroupBuilder groupBuilder = app.MapGroup("/auth").WithTags("Auth");

        groupBuilder.MapPost("/register", async (ISender sender, RegisterCommand request, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).Produces<Result<string>>();

        groupBuilder.MapPost("/login", async (ISender sender, LoginCommand request, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);

        }).Produces<Result<LoginCommandResponse>>();
    }
}
