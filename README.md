I created the Management service for the  Algonquin Pet Store
Setup Instructions
1. Clone Repository
bash
Copy code
git clone https://github.com/shivareddysama/management-service.git
cd management-service
2. Install Dependencies
Ensure you have Node.js installed. Then, install the project dependencies:

bash
Copy code
npm install
3. Environment Configuration
Create a .env file in the root directory with the following details:

makefile
Copy code
PORT=3000
RABBITMQ_URL=amqp://username:password@hostname:5672
QUEUE_NAME=order_queue
4. Run the Service Locally
bash
Copy code
npm start
API Endpoints
GET /api/orders – Retrieve all orders
GET /api/orders/:id – Retrieve a specific order by ID
GET /api/orders/status/:status – Filter orders by status
Deployment Instructions
Deploy the service to Azure Web App Service.
Set environment variables (RabbitMQ URL, Queue Name) in the Azure portal.
Integrate with RabbitMQ running on Azure VM.
Testing Instructions
Use the included .http file for testing the API endpoints using VS Code’s REST Client.
