const { createClient } = require("redis");

const redisClient = createClient({ host: "localhost", port: 6379 });

redisClient.on("error", (err) =>
  console.log("Redis Client Connection Error", err)
);

module.exports = redisClient;
