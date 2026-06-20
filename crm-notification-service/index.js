const amqp = require('amqplib');

async function startWorker() {
    try {
        // Conecta no RabbitMQ que está rodando no Docker
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        
        const queue = 'lead_created_queue';
        await channel.assertQueue(queue, { durable: true });

        console.log(`[*] Aguardando mensagens na fila: ${queue}.`);

        // Escuta a fila continuamente
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const leadData = JSON.parse(msg.content.toString());
                
                console.log(`[x] Novo Lead Recebido! Enviando e-mail para: ${leadData.Email}`);
                
                // Confirma que processou a mensagem para tirá-la da fila
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Erro no Worker Node:", error);
    }
}

startWorker();