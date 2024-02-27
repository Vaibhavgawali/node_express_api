const { createClient } = require("redis");

const redisURL = process.env.REDIS_URL;

const redisClient = createClient(redisURL);

redisClient.on("error", (err) =>
  console.log("Redis Client Connection Error", err)
);

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

module.exports = redisClient;
