const asyncHandler = require("express-async-handler");
const { verify } = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authToken = req.headers.Authorization || req.headers.authorization;
  if (authToken && authToken.startsWith("Bearer")) {
    token = authToken.split(" ")[1];
    verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is unauthorized or missing token  !");
      }
      req.user = decoded.user;
      next();
    });
  }
  if (!token) {
    res.status(401);
    throw new Error("User is unauthorized !");
  }
});

module.exports = validateToken;
