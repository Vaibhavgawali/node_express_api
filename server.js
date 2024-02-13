const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const contactRoute = require("./routes/contactRoutes");
const userRoute = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

app.use(express.json());

app.use("/api/contacts", contactRoute);
app.use("/api/users", userRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
