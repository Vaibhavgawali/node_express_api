const asyncHandler = require("express-async-handler");
const redisClient = require("./redisClient");

const getContactFromCache = async (userId, contactId) => {
  try {
    if (!redisClient.connected) {
      await redisClient.connect();
    }

    let cachedContacts = await redisClient.get(`contacts:${userId}`);
    if (cachedContacts) {
      let parsedCachedContacts = JSON.parse(cachedContacts);
      let contacts = parsedCachedContacts.contacts;
      let contact = contacts.find((contact) => contact._id === contactId);

      await redisClient.disconnect();

      return contact;
    } else {
      await redisClient.disconnect();

      return null;
    }
  } catch (error) {
    console.error("Error while accessing Redis:", error);
    return null;
  }
};

const addContactToCache = async (userId, newContact) => {
  try {
    if (!redisClient.connected) {
      await redisClient.connect();
    }

    let cachedContacts = await redisClient.get(`contacts:${userId}`);

    if (cachedContacts) {
      let parsedCachedContacts = JSON.parse(cachedContacts);
      let contacts = parsedCachedContacts.contacts;
      contacts.push(newContact);
      await redisClient.set(
        `contacts:${userId}`,
        JSON.stringify({
          message: "Contacts fetched successfully from redis !",
          contacts,
        }),
        { EX: 100 }
      );
      await redisClient.disconnect();
    } else {
      await redisClient.disconnect();

      return true;
    }
  } catch (error) {
    console.error("Error while accessing Redis:", error);
  }
};

const deleteContactFromCache = async (userId, contactId) => {
  try {
    if (!redisClient.connected) {
      await redisClient.connect();
    }

    let cachedContacts = await redisClient.get(`contacts:${userId}`);

    if (cachedContacts) {
      let parsedCachedContacts = JSON.parse(cachedContacts);
      let contacts = parsedCachedContacts.contacts.filter(
        (contact) => contact._id !== contactId
      );
      await redisClient.set(
        `contacts:${userId}`,
        JSON.stringify({
          message: "Contacts fetched successfully from redis !",
          contacts,
        }),
        { EX: 100 }
      );
      await redisClient.disconnect();
    } else {
      await redisClient.disconnect();

      return true;
    }
  } catch (error) {
    console.error("Error while accessing Redis:", error);
  }
};

const updateContactInCache = async (userId, updatedContact) => {
  try {
    if (!redisClient.connected) {
      await redisClient.connect();
    }

    let cachedContacts = await redisClient.get(`contacts:${userId}`);

    if (cachedContacts) {
      let parsedCachedContacts = JSON.parse(cachedContacts);
      let contacts = parsedCachedContacts.contacts.map((contact) => {
        if (contact._id === updatedContact._id) {
          return updatedContact;
        }
        return contact;
      });

      await redisClient.set(
        `contacts:${userId}`,
        JSON.stringify({
          message: "Contacts fetched successfully from redis !",
          contacts,
        }),
        { EX: 100 }
      );

      await redisClient.disconnect();
    } else {
      await redisClient.disconnect();

      return true;
    }
  } catch (error) {
    console.error("Error while accessing Redis:", error);
  }
};

module.exports = {
  getContactFromCache,
  addContactToCache,
  deleteContactFromCache,
  updateContactInCache,
};
