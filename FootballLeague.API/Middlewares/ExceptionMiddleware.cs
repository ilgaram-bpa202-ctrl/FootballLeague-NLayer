using FootballLeague.Core.DTOs;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json;

namespace FootballLeague.API.Middlewares
{
    public static class ExceptionMiddleware
    {
        public static void UseCustomException(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(config =>
            {
                config.Run(async context =>
                {
                    context.Response.ContentType = "application/json";

                    var exceptionFeature = context.Features.Get<IExceptionHandlerFeature>();

                    // Xətanın status kodunu təyin edirik (hələlik hamısına 500 deyirik)
                    var statusCode = StatusCodes.Status500InternalServerError;

                    context.Response.StatusCode = statusCode;

                    var response = new ErrorDto(exceptionFeature.Error.Message, statusCode);

                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                });
            });
        }
    }
}