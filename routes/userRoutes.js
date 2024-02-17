const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register new user
 *     description: Register new user to the database.
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                         type: string
 *                         description: User's full name
 *                      email:
 *                         type: string
 *                         format: email
 *                         description: User's email
 *                      password:
 *                          type: string
 *                          format: password
 *                          description: User's password
 *                      phone:
 *                          type: string
 *                          description: User's phone number
 *                  required:
 *                      - name
 *                      - email
 *                      - password
 *     responses:
 *       201:
 *         description: Successful response with a registered user.
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized. Invalid email or password.
 */

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get a logged user information
 *     description: Current logged used information. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user information.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to access the resource.
 */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);

module.exports = router;
