using CRMModular.Domain.Entities;

namespace CRMModular.Domain.Repositories;

public interface ILeadRepository
{
    Task<Lead> AddAsync(Lead lead);
    Task<Lead?> GetByIdAsync(Guid id);
    Task<IEnumerable<Lead>> GetAllAsync();
}