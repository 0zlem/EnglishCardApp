using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Word.Command;
using MediatR;
using TS.Result;

namespace EnglishCardApp.WebAPI.Modules;

public static class WordModule
{

    public static void RegisterWordRoutes(this IEndpointRouteBuilder app)
    {
        RouteGroupBuilder groupBuilder = app.MapGroup("/word").WithTags("Words");

        groupBuilder.MapPost("/create", async (ISender sender, CreateWordCommand request, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).Produces<Result<string>>();


    }

}