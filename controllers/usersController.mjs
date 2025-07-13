import User from "../models/User.mjs";
import Place from "../models/Place.mjs";
import HttpError from "../models/httpError.mjs";

// CREATE USER
export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "user already exist with this email" });
    }
    const newUser = await User.create({ name, email });
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error.message, { error_message: error });
  }
};

// GET SINGLE USER
export const getUser = async (req, res, next) => {
  const { id } = req.params; // ya req.body.id, jahan se id aa rahi ho
  try {
    const user = await User.findById(id).populate("places");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
    console.log({ message: error.message, error: error });
  }
};

// GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().populate("places");
    res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const vanishUser = await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "deleted", vanishUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

