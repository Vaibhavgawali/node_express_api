const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const redisClient = require("../utils/redisClient");
const {
  getContactFromCache,
  addContactToCache,
  deleteContactFromCache,
  updateContactInCache,
} = require("../utils/cacheUtils");
const {
  validateCommonFields,
  validateFormWithPassword,
  handleValidationErrors,
} = require("../middleware/formValidation");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
// const getContacts = asyncHandler(async (req, res) => {
//   // search query parameter
//   const queryParam = req.query.q;

//   // Sorting parameter
//   const sortBy = req.query.sortBy || "name";
//   const sortOrder = req.query.sortOrder || "asc";

//   // Pagination parameters
//   const page = parseInt(req.query.page) || 1;
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = startIndex + pageSize;

//   await redisClient.connect();

//   let result = await redisClient.get(`contacts:${req.user.id}`);
//   if (result) {
//     const { message, contacts } = JSON.parse(result);
//     let output = contacts;

//     // search query
//     if (queryParam) {
//       const regex = new RegExp(queryParam, "i");
//       output = contacts.filter(
//         (contact) => contact.name.match(regex) || contact.email.match(regex)
//       );
//     }

//     // if (output === undefined) {
//     //   return res.status(200).json({
//     //     message: "No contacts found!",
//     //     user_id: req.user.id,
//     //   });
//     // }

//     // Sorting
//     output.sort((a, b) => {
//       if (sortOrder === "asc") {
//         return a[sortBy].localeCompare(b[sortBy]);
//       } else {
//         return b[sortBy].localeCompare(a[sortBy]);
//       }
//     });

//     // Pagination
//     const paginatedContacts = output.slice(startIndex, endIndex);

//     res.status(200).json({ message, contacts: paginatedContacts });
//     await redisClient.disconnect();
//   } else {
//     const query = queryParam
//       ? {
//           $or: [
//             { name: { $regex: queryParam, $options: "i" } },
//             { email: { $regex: queryParam, $options: "i" } },
//           ],
//         }
//       : {};

//     const contacts = await Contact.find({
//       $and: [{ user_id: req.user.id }, query],
//     });

//     if (contacts.length === 0) {
//       res
//         .status(200)
//         .json({ message: "Contacts not found !", user_id: req.user.id });
//     }

//     await redisClient.set(
//       `contacts:${req.user.id}`,
//       JSON.stringify({
//         message: "Contacts fetched successfully from redis !",
//         contacts,
//       }),
//       { EX: 100, NX: true }
//     );

//     // Sorting
//     output.sort((a, b) => {
//       if (sortOrder === "asc") {
//         return a[sortBy].localeCompare(b[sortBy]);
//       } else {
//         return b[sortBy].localeCompare(a[sortBy]);
//       }
//     });

//     // pagination
//     const paginatedContacts = contacts.slice(startIndex, endIndex);

//     res.status(200).json({
//       message: "Contacts fetched successfully from db !",
//       contacts: paginatedContacts,
//     });
//     await redisClient.disconnect();
//   }
// });
const getContacts = asyncHandler(async (req, res) => {
  // search query parameter
  const queryParam = req.query.q;

  // Sorting parameter
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  if (!redisClient.connected) {
    await redisClient.connect();
  }

  let result = await redisClient.get(`contacts:${req.user.id}`);
  if (result) {
    const { message, contacts } = JSON.parse(result);
    let output = contacts;

    // search query
    if (queryParam) {
      const regex = new RegExp(queryParam, "i");
      output = output.filter(
        (contact) => contact.name.match(regex) || contact.email.match(regex)
      );
    }

    // Sorting
    output.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });

    // Pagination
    const paginatedContacts = output.slice(startIndex, endIndex);

    res.status(200).json({ message, contacts: paginatedContacts });
    await redisClient.disconnect();
  } else {
    const query = queryParam
      ? {
          $or: [
            { name: { $regex: queryParam, $options: "i" } },
            { email: { $regex: queryParam, $options: "i" } },
          ],
        }
      : {};

    const contacts = await Contact.find({
      $and: [{ user_id: req.user.id }, query],
    });

    if (contacts.length === 0) {
      res
        .status(200)
        .json({ message: "Contacts not found !", user_id: req.user.id });
    }

    // Sorting
    contacts.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });

    await redisClient.set(
      `contacts:${req.user.id}`,
      JSON.stringify({
        message: "Contacts fetched successfully from redis !",
        contacts,
      }),
      { EX: 100, NX: true }
    );

    // Pagination
    const paginatedContacts = contacts.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Contacts fetched successfully from db !",
      contacts: paginatedContacts,
    });
    await redisClient.disconnect();
  }
});

//@desc Create new contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: userId,
  });

  // Add new contact to Redis cache
  await addContactToCache(userId, contact);

  res.status(201).json({ message: "Contact added successfully", contact });
});

//@desc Get contact by Id
//@route GET /api/contacts/:id
//@access private
const getContactById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const cachedContact = await getContactFromCache(userId, id);
  if (cachedContact) {
    res.status(200).json({
      message: "Contact fetched successfully from cache",
      contact: cachedContact,
    });
  }

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found !");
  }
  res.status(200).json({ message: "Conatct fetched successfully", contact });
});

//@desc Update contact by Id
//@route PATCH /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found !");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update this contact !");
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  // Update contact in Redis cache
  await updateContactInCache(userId, updatedContact);

  res
    .status(200)
    .json({ message: "Conatct updated successfully", updatedContact });
});

//@desc Delete contact by Id
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found !");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete this contact !");
  }
  const deletedContact = await Contact.findByIdAndDelete(id);

  // Delete contact from Redis cache
  await deleteContactFromCache(userId, id);

  res
    .status(200)
    .json({ message: "Conatct deleted successfully", deletedContact });
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
