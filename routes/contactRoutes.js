const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get a list of contacts
 *     description: Retrieve a list of contacts from the database. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with a list of contacts.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to access the resource.
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Create a new contact in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                         type: string
 *                         description:  full name of contact
 *                      email:
 *                         type: string
 *                         format: email
 *                         description: email of contact
 *                      phone:
 *                          type: string
 *                          description: phone number of contact
 *                  required:
 *                      - name
 *                      - email
 *                      - phone
 *     responses:
 *       201:
 *         description: Contact added successfully.
 *       400:
 *         description: Invalid input. Missing or incorrect request body.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     description: Retrieve a contact by its ID from the database. Authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the contact.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to access the resource.
 *       404:
 *         description: Contact not found.
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     summary: Update a contact
 *     description: Update an existing contact in the database. Authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to update.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the updated contact.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to access the resource.
 *       404:
 *         description: Contact not found.
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     description: Delete a contact by its ID from the database. Authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the deleted contact.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to access the resource.
 *       404:
 *         description: Contact not found.
 */

router.route("/").get(getContacts).post(createContact);
router
  .route("/:id")
  .get(getContactById)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
