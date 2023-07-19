const fastify = require('fastify')({ logger: true });
const populationRoutes = require('./routes/populationRoutes'); 


fastify.register(populationRoutes);

const startServer = async () => {
  try {
    const serverOptions = {
      port: 5555
    };
    await fastify.listen(serverOptions);
    console.log('Server is running on port 5555');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();






