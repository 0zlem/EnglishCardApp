using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnglishCardApp.Application.Word;
using EnglishCardApp.Application.Word.Command;
using EnglishCardApp.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TS.Result;

namespace EnglishCardApp.WebAPI.Modules;

public static class WordModule
{

    public static void RegisterWordRoutes(this IEndpointRouteBuilder app)
    {
        RouteGroupBuilder groupBuilder = app.MapGroup("/words").WithTags("Words");

        groupBuilder.MapGet("", async (ISender sender, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(new GetAllWordsQuery(), cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).Produces<Result<List<Words>>>();

        groupBuilder.MapGet("/{Id:guid}", async (ISender sender, Guid Id, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(new GetWordByIdQuery(Id), cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).Produces<Result<Words>>();

        groupBuilder.MapPost("/create", async (ISender sender, [FromForm] CreateWordCommand request, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);

            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).DisableAntiforgery().Produces<Result<string>>();

        groupBuilder.MapDelete("/delete/{Id:guid}", async (ISender sender, Guid Id, CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(new DeleteWordCommand(Id), cancellationToken);
            return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
        }).Produces<Result<Guid>>();


    }

}