const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  changePassword,
  uploadProfileImage,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const {
  validateUserForm,
  validateChangePasswordForm,
  validateImage,
  handleValidationErrors,
} = require("../middleware/formValidation");

const upload = require("../config/multerConfig");
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

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change password of user
 *     description: Change password of current logged-in user in the database.
 *     security :
 *      - bearerAuth : []
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                         type: string
 *                         format: email
 *                         description: User's email
 *                      password:
 *                          type: string
 *                          format: password
 *                          description: User's current password
 *                      newPass:
 *                          type: string
 *                          format: password
 *                          description: User's new password
 *                      confirmPass:
 *                          type: string
 *                          format: password
 *                          description: Confirm new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request. Check if all fields are provided and if new password matches confirm password.
 *       401:
 *         description: Unauthorized. Incorrect current password provided.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/users/upload-image:
 *   post:
 *     summary: Upload an image
 *     description: Uploads an image file with validation
 *     security :
 *       - bearerAuth : []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '400':
 *         description: Bad request or validation error
 */

router.post(
  "/register",
  validateUserForm,
  handleValidationErrors,
  registerUser
);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.post(
  "/change-password",
  validateToken,
  validateChangePasswordForm,
  handleValidationErrors,
  changePassword
);
router.post(
  "/upload-image",
  validateToken,
  // validateImage,
  // handleValidationErrors,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;
