import mongoose from "mongoose";
import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Place from "../models/Place.mjs";
import HttpError from "../models/httpError.mjs";
import dotenv from "dotenv";
dotenv.config();

// CREATE USER
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ success: false, message: "This email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      placesInUser: [],
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res
      .status(201)
      .json({ success: true, userId: newUser.id, email: newUser.email, token });
  } catch (error) {
    res.status(500).send("Server error: something went wrong");
  }
};

// LOGIN USER
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "error: user not found " });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.json({ message: "error: incorrect password " });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_secret, {
      expiresIn: "24h",
    });

    return res.status(200).json({ userId: user.id, email: user.email, token });
  } catch (error) {
    return res.status(500).json({ msg: "server error something went wrong" });
  }
};

// GET SINGLE USER
export const getUser = async (req, res, next) => {
  const { id } = req.params; // ya req.body.id, jahan se id aa rahi ho
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("placesInUser"); // populate will fetch places as well
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
    console.log({ message: error.message, error: error });
  }
};

// UPDATE SINGLE USER
export const updateUser = async (req, res, next) => {
  const newData = req.body;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const myExistPlace = await User.findById(id);
    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 12);
    }
    if (!myExistPlace) {
      return res.status(404).json({ message: "user not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
    }).select("-password");
    return res.status(200).json({ message: "Got you User", updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find()
      .select("-password")
      .populate("placesInUser");
    res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE SINGLE USER
export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const existingUser = await User.findById(userId);

  await Place.deleteMany({ creator: userId });

  if (!existingUser) return res.status(404).json({ error: "user not found" });
  try {
    const vanishUser = await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "deleted", vanishUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE ALL USERS AND THEIR PLACES
export const deleteAllUsers = async (req, res, next) => {
  try {
    await Place.deleteMany();

    await User.deleteMany();

    return res.status(200).json({
      message: "All users and their places have been deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

