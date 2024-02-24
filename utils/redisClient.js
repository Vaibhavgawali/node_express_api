const { createClient } = require("redis");

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("error", (err) =>
  console.log("Redis Client Connection Error", err)
);

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

module.exports = redisClient;
