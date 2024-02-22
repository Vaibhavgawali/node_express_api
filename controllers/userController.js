const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

//@desc Register user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("All fields are required !");
  }
  const userAvailabel = await User.findOne({ email });
  if (userAvailabel) {
    res.status(400);
    throw new Error("User already exists !");
  }
  const salt = genSaltSync(10);
  const hashPassword = hashSync(password, salt);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashPassword,
  });
  if (user) {
    res.status(201).json({
      message: "User registered successfully !",
      id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid !");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required !");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Inavlid email or password !");
  }
  const result = compareSync(password, user.password);
  if (!result) {
    res.status(401);
    throw new Error("Invalid email or password !");
  }
  user.password = undefined;
  const jwtoken = sign(
    {
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    },
    process.env.JWT_KEY,
    { expiresIn: 3600 }
  );
  res
    .status(200)
    .json({ message: "User logged in successfully !", token: jwtoken });
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "Current user information", user });
});

//@desc Current user chane password
//@route POST /api/users/change-password
//@access private
const changePassword = asyncHandler(async (req, res) => {
  const { email, password, newPass, confirmPass } = req.body;

  if (!email || !password || !newPass || !confirmPass) {
    res.status(400);
    throw new Error("All fields are required !");
  }

  if (email !== req.user.email) {
    res.status(403);
    throw new Error("You don't have rights !");
  }
  if (newPass !== confirmPass) {
    res.status(400);
    throw new Error("Confirm Password and new password are not matching !");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password !");
  }
  const result = compareSync(password, user.password);
  if (!result) {
    res.status(401);
    throw new Error("Invalid email or password !");
  }

  if (password === newPass) {
    res.status(400);
    throw new Error("Current and new password are same !");
  }

  const salt = genSaltSync(10);
  const hashPassword = hashSync(newPass, salt);

  user.password = hashPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully !" });
});

const uploadProfileImage = (req, res) => {
  const imageFile = req.file;

  if (!imageFile) {
    res.status(400);
    throw new Error("No image file uploaded !");
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedMimeTypes.includes(imageFile.mimetype)) {
    res.status(400);
    throw new Error(
      "Invalid file format. Only JPEG, PNG, and JPG files are allowed"
    );
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error("File size must be less than 5MB");
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    fileName: imageFile.filename,
  });
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  changePassword,
  uploadProfileImage,
};
