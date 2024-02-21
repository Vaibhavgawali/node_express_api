const { body, validationResult } = require("express-validator");

const validateContactForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Name must contain only alphabetic characters"),

  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),

  body("phone")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format"),
];

const validatePassword = [
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters long")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one number, and one special character"
    ),
];

const validateUserForm = [...validateContactForm, ...validatePassword];

const validateChangePasswordForm = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),

  body("password").notEmpty().withMessage("Password is required"),

  body("newPass")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be between 8 and 16 characters long")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage(
      "New password must contain at least one uppercase letter, one number, and one special character"
    ),

  body("confirmPass")
    .custom((value, { req }) => {
      if (value !== req.body.newPass) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .withMessage("Passwords do not match"),
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((error) => ({ [error.path]: error.msg }));
    return res.status(400).json({ errors: extractedErrors });
  }
  next();
};

module.exports = {
  validateContactForm,
  validateUserForm,
  validateChangePasswordForm,
  handleValidationErrors,
};
