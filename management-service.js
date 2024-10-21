// Import required modules
const express = require('express'); // Express framework for building the web application.
const amqp = require('amqplib/callback_api'); // RabbitMQ client library using AMQP.
const cors = require('cors'); // CORS middleware to handle cross-origin requests.
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express app instance.
app.use(express.json()); // Middleware to parse JSON request bodies.

// Enable CORS for all routes
app.use(cors());

// Environment variables for RabbitMQ connection string and server port
const RABBITMQ_CONNECTION_STRING = process.env.RABBITMQ_CONNECTION_STRING || 'amqp://localhost';  // Fallback to localhost if not set
const PORT = process.env.PORT || 3001;  // Fallback to port 3001 if not set

// Function to retrieve messages from the queue
const fetchOrdersFromQueue = (callback) => {
  // Connect to RabbitMQ
  amqp.connect(RABBITMQ_CONNECTION_STRING, (err, conn) => {
    if (err) {
      // If error occurs during RabbitMQ connection, pass the error to the callback.
      return callback(err, null);
    }

    // Create a channel for communication
    conn.createChannel((err, channel) => {
      if (err) {
        return callback(err, null); // If error creating channel, pass error to callback.
      }

      const queue = 'order_queue'; // Queue name to consume messages from

      // Assert the queue (create if doesn't exist)
      channel.assertQueue(queue, { durable: false });

      // Fetch a message from the queue
      channel.get(queue, { noAck: true }, (err, msg) => {
        if (err) {
          return callback(err, null); // Error handling during message consumption
        }

        if (msg) {
          const order = JSON.parse(msg.content.toString()); // Parse message to JSON object
          console.log("Fetched order from queue:", order);
          return callback(null, order); // Pass the order to the callback
        } else {
          return callback(null, null); // No message in queue, return null
        }
      });
    });
  });
};

// GET route to fetch an order from the queue
app.get('/orders', (req, res) => {
  fetchOrdersFromQueue((err, order) => {
    if (err) {
      return res.status(500).send('Error fetching order from queue');
    }

    if (order) {
      res.json(order); // Return the fetched order as JSON response
    } else {
      res.status(404).send('No orders in queue');
    }
  });
});

// Start the management service server
app.listen(PORT, () => {
  console.log(`Management service is running on http://localhost:${PORT}`);
});
