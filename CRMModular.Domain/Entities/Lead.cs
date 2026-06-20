namespace CRMModular.Domain.Entities;

public class Lead
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Status { get; set; } = "New"; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Multi-tenant: Vincula o Lead a uma empresa específica
    public Guid OrganizationId { get; set; }
}