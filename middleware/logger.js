const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(__dirname, "..", "log");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDirectory, "access.log"),
  { flags: "a" }
);
const errorLogStream = fs.createWriteStream(
  path.join(logsDirectory, "error.log"),
  {
    flags: "a",
  }
);

morgan.token("req-body", (req) => {
  return JSON.stringify(req.body);
});

const requestLogger = morgan(
  ":date[iso] :method :url :status :response-time ms - :req-body",
  { stream: accessLogStream }
);

morgan.token("error-message", (req, res) => {
  if (res.statusCode >= 400) {
    return res.locals.errorMessage || "No error message available";
  }
  return "";
});

const errorLogger = morgan(
  "[:date[iso]] :method :url :status :response-time ms - :req-body - :error-message",
  {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream,
  }
);

module.exports = { requestLogger, errorLogger };
