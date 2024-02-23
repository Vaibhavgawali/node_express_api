const { createClient } = require("redis");

const redisClient = createClient({ host: "localhost", port: 6379 });

redisClient.on("error", (err) =>
  console.log("Redis Client Connection Error", err)
);

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

module.exports = redisClient;
