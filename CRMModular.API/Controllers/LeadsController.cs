using CRMModular.Application.Services;
using CRMModular.Application.DTOs;    
using CRMModular.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CRMModular.API.Controllers;

[ApiController]
[Route("api/[controller]")] // O link será: http://localhost:XXXX/api/leads
public class LeadsController : ControllerBase
{
    private readonly LeadApplicationService _leadService;

    public LeadsController(LeadApplicationService leadService)
    {
        _leadService = leadService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLeadDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrEmpty(dto.Email))
        {
            return BadRequest("Nome e E-mail são obrigatórios.");
        }
    
        try{
            var lead = new Lead
            {
                Name = dto.Name,
                Email = dto.Email,
                CompanyName = dto.CompanyName
            };

            var createdLead = await _leadService.CreateLeadAsync(lead);
            // Retorna o status HTTP 201 (Created) e o Lead que foi salvo
            return CreatedAtAction(nameof(GetById), new { id = createdLead.Id }, createdLead);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao criar Lead: {ex.Message}");
            return StatusCode(500, "Ocorreu um erro interno. Tente novamente mais tarde.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var lead = await _leadService.GetByIdAsync(id);

        if (lead is null)
        {
            return NotFound();
        }

        return Ok(lead);
    }
    
}