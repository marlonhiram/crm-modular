using CRMModular.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRMModular.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    // ID da empresa simulada (em produção, capturamos do Token JWT)
    private readonly Guid _currentOrganizationId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Lead> Leads { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // REGRA DE OURO PARA A ENTREVISTA (Multi-tenant):
        // Esse filtro impede que a Empresa A veja os Leads da Empresa B
        modelBuilder.Entity<Lead>().HasQueryFilter(l => l.OrganizationId == _currentOrganizationId);
    }
}