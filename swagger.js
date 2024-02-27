const swaggerJSDoc = require("swagger-jsdoc");
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node Js api Project",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.APP_DOMAIN || `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
