using CRMModular.Domain.Entities;
using CRMModular.Domain.Repositories;
using CRMModular.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CRMModular.Infrastructure.Repositories;

public class LeadRepository : ILeadRepository
{
    private readonly ApplicationDbContext _dbContext;

    public LeadRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Lead> AddAsync(Lead lead)
    {
        _dbContext.Leads.Add(lead);
        await _dbContext.SaveChangesAsync();
        return lead;
    }

    public async Task<Lead?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Leads.FirstOrDefaultAsync(l => l.Id == id);
    }
}