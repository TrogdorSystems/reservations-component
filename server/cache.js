const redis = require('redis');

const redisClient = redis.createClient('redis://ec2-13-57-38-207.us-west-1.compute.amazonaws.com');

redisClient.on('error', (err) => {
  console.error(err);
});

module.exports = redisClient;
