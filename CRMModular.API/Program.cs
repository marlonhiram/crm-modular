using CRMModular.Domain.Repositories;
using Scalar.AspNetCore;
using CRMModular.Infrastructure.Repositories;
using CRMModular.Application.Services;
using CRMModular.Infrastructure.Messaging;
using CRMModular.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// 1. REGISTRO DE SERVIÇOS (CONTAINER DE INJEÇÃO DE DEPENDÊNCIA)
// =========================================================================

// OBRIGATÓRIO: Ensina o .NET a trabalhar com o padrão de Controllers
builder.Services.AddControllers();

// Configura o OpenAPI (Swagger) para documentar a API
builder.Services.AddOpenApi();

// Configura a conexão com o banco de dados PostgreSQL que está no Docker
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registra as classes que nós criamos para que o .NET saiba injetá-las onde for pedido
builder.Services.AddScoped<LeadApplicationService>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddSingleton<IMessageProducer, RabbitMqProducer>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// =========================================================================
// 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES HTTP (MIDDLEWARES)
// =========================================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

// OBRIGATÓRIO: Diz para o .NET mapear as rotas que criamos dentro das Controllers (ex: api/leads)
app.MapControllers();

app.Run();