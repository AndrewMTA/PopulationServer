const populationController = require('../controllers/populationController');

const populationRoutes = async (fastify) => {
  fastify.get('/api/population/state/:state/city/:city', populationController.getPopulation);

  fastify.put('/api/population/state/:state/city/:city', populationController.updatePopulation);
};

module.exports = populationRoutes;
