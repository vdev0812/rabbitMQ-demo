const amqp = require('amqplib');
const config = require('./config');
// Step 1: Connect to the rabbitmq server
// Step 2: Create a new channel on that connection
// Step 3: Create the exchange
// Step 4: Publish the message to the exchange with a routing key

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url)
        this.channel = await connection.createChannel();
    }
    
    async publishMessage(routingKey, message) {
        if(!this.channel)
            await this.createChannel();
    
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, 'direct');

        const logDetails = JSON.stringify({
                logType: routingKey,
                message: message,
                datetime: new Date(),
            });
        await this.channel.publish(exchangeName, routingKey, 
            Buffer.from(logDetails)    
        );

        console.log(`The message ${message} is sent to exchange ${exchangeName}`);
    }
}

module.exports = Producer;
