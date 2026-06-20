using CRMModular.Domain.Events;

namespace CRMModular.Domain.Repositories;

public interface IMessageProducer
{
    Task PublishLeadCreatedAsync(LeadCreatedEvent leadData);
}