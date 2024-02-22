const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const contactRoute = require("./routes/contactRoutes");
const userRoute = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

const SwaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { requestLogger, errorLogger } = require("./middleware/logger");

connectDb();
const app = express();
app.use(express.static("uploads"));
app.use(express.json());

app.use(requestLogger);
app.use(errorLogger);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.locals.errorMessage = err.message || "Unknown error occurred";
  res.status(500).json({ error: res.locals.errorMessage });
});

app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
app.use("/api/contacts", contactRoute);
app.use("/api/users", userRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
