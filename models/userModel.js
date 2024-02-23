const mongoose = require("mongoose");

const usersShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name !"],
    },
    email: {
      type: String,
      required: [true, "Please enter email !"],
      unique: [true, "Email address already taken !"],
    },
    phone: {
      type: String,
      required: [true, "Please enter phone !"],
    },
    password: {
      type: String,
      required: [true, "Please enter password !"],
    },
    profile_img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// usersShema.set("timestamps", true);

module.exports = mongoose.model("User", usersShema);
