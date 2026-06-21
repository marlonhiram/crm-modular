using CRMModular.Domain.Entities;
using CRMModular.Domain.Repositories;
using CRMModular.Domain.Events;

namespace CRMModular.Application.Services;

public class LeadApplicationService
{
    private readonly ILeadRepository _leadRepository;
    private readonly IMessageProducer _messageProducer; // Usando a Interface agora!

    public LeadApplicationService(ILeadRepository leadRepository, IMessageProducer messageProducer)
    {
        _leadRepository = leadRepository;
        _messageProducer = messageProducer;

        
    }

    public async Task<Lead> CreateLeadAsync(Lead lead)
    {
        if (lead.OrganizationId == Guid.Empty)
        {
            lead.OrganizationId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        }

        var createdLead = await _leadRepository.AddAsync(lead);

        // Dispara o evento usando a interface
        var messageEvent = new LeadCreatedEvent
        {
            Id = createdLead.Id,
            Name = createdLead.Name,
            Email = createdLead.Email
        };
        await _messageProducer.PublishLeadCreatedAsync(messageEvent);

        return createdLead;
    }

    public async Task<Lead?> GetByIdAsync(Guid id)
    {
        return await _leadRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Lead>> GetAllAsync()
    {
        return await _leadRepository.GetAllAsync();
    }
}