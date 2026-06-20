using System.Text;
using System.Text.Json;
using CRMModular.Domain.Events;
using CRMModular.Domain.Repositories;
using RabbitMQ.Client;

namespace CRMModular.Infrastructure.Messaging;

public class RabbitMqProducer : IMessageProducer
{
    // Guarda a conexão como campo da classe, para ser reutilizada em todas as chamadas
    private readonly IConnection _connection;

    // O construtor roda só UMA vez, quando o Singleton é criado na inicialização da API
    public RabbitMqProducer()
    {
        // 1. Cria a conexão com o servidor RabbitMQ do Docker (uma única vez)
        var factory = new ConnectionFactory { HostName = "localhost", Port = 5672 };
        _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
    }

    public async Task PublishLeadCreatedAsync(LeadCreatedEvent leadData)
    {
        try
        {
            // 2. Cria o canal — é leve, pode ser aberto a cada chamada sem custo alto
            using var channel = await _connection.CreateChannelAsync();

            // 3. Garante que a fila existe com o mesmo nome que o Node está ouvindo
            string queueName = "lead_created_queue";
            await channel.QueueDeclareAsync(
                queue: queueName, 
                durable: true, 
                exclusive: false, 
                autoDelete: false, 
                arguments: null
            );

            // 4. Transforma o evento em texto JSON e depois em Bytes
            var json = JsonSerializer.Serialize(leadData);
            var body = Encoding.UTF8.GetBytes(json);

            // 5. Publica a mensagem na fila
            await channel.BasicPublishAsync(
                exchange: string.Empty, 
                routingKey: queueName, 
                body: body
            );
            
            Console.WriteLine($"[x] Mensagem enviada para o RabbitMQ: {json}");
        }
        catch (Exception ex)
        {
            // Se o Rabbit estiver fora do ar, loga o erro mas não derruba o sistema
            Console.WriteLine($"[!] Falha ao publicar mensagem no RabbitMQ: {ex.Message}");
        }
    }
}