const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error(err);
});

module.exports = redisClient;
