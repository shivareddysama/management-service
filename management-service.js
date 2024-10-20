// Import required modules
const amqp = require('amqplib/callback_api');  // AMQP client library for RabbitMQ
 
// URL for connecting to RabbitMQ
const RABBITMQ_URL = 'amqp://localhost';
const queue = 'order_queue';  // Queue name
 
// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, (err, connection) => {
  if (err) {
    console.error('Error connecting to RabbitMQ:', err);
    return;
  }
 
  console.log('Connected to RabbitMQ successfully.');
 
  // Create a channel
  connection.createChannel((err, channel) => {
    if (err) {
      console.error('Error creating channel:', err);
      connection.close();
      return;
    }
 
    // Assert the queue to ensure it exists and is durable
    channel.assertQueue(queue, { durable: true });
 
    console.log(`Waiting for messages in queue: "${queue}"`);
 
    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log('Received order:', order);
 
        // Acknowledge the message to remove it from the queue
        channel.ack(msg);
      } else {
        console.warn('Received a null message');
      }
    }, {
      // Ensures the message is acknowledged only after processing
      noAck: false
    });
 
    // Graceful shutdown: Close the connection on SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('Closing RabbitMQ connection...');
      channel.close(() => {
        connection.close(() => {
          console.log('Connection closed. Exiting...');
          process.exit(0);
        });
      });
    });
  });
});