using EnglishCardApp.Application;
using EnglishCardApp.Infrastructure;
using EnglishCardApp.WebAPI.Modules;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddOpenApi();
builder.Services.AddApplication();
builder.Services.AddInfrastructureRegistrar(builder.Configuration);

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.RegisterRoutes();

app.MapGet("/", () => Results.Redirect("/scalar/v1"));
app.MapOpenApi();
app.MapScalarApiReference();

app.Run();



