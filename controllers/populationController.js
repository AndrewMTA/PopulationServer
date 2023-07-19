const db = require('../config/database.js'); 

async function getPopulation(request, reply) {
  const { state, city } = request.params;
  try {
    const doc = await new Promise((resolve, reject) => {
      db.findOne({ state: state.toLowerCase(), city: city.toLowerCase() }, (err, doc) => {
        if (err || !doc) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });

    if (!doc) {
      reply.code(404).send({ error: 'State / city combo not found' });
    } else {
      reply.send({ population: doc.population });
    }
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
}

async function updatePopulation(request, reply) {
  const { state, city } = request.params;
  const { population } = request.body;

  if (isNaN(population)) {
    reply.code(400).send({ error: 'Invalid population' });
    return;
  }

  try {
    const updateResult = await new Promise((resolve, reject) => {
      db.update(
        { state: state.toLowerCase(), city: city.toLowerCase() },
        { $set: { population: Number(population) } },
        { upsert: true, returnUpdatedDocs: true },
        (err, numAffected, affectedDocuments) => {
          if (err) {
            reject(err);
          } else {
            resolve(numAffected === 1 ? affectedDocuments : numAffected);
          }
        }
      );
    });

    if (updateResult && typeof updateResult === 'object') {
      reply.code(200).send(updateResult);
    } else if (typeof updateResult === 'number') {
      reply.code(201).send({ affectedCount: updateResult });
    } else {
      reply.code(400).send({ error: 'Data could not be retrieved' });
    }
  } catch (err) {
    reply.code(400).send({ error: 'Data could not be added' });
  }
}

module.exports = { getPopulation, updatePopulation };