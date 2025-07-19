import mongoose from "mongoose";
import Place from "../models/Place.mjs";
import User from "../models/User.mjs";

// GET SINGLE PLACE
export const getPlace = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid place id" });
  }

  try {
    const myplace = await Place.findById(req.params.id);
    if (!myplace) {
      return res.status(404).json({ message: "not found place" });
    }
    return res.status(200).json({ message: "Got you place", myplace });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL PLACES
export const getPlaces = async (req, res, next) => {
  try {
    const allPlaces = await Place.find();
    if (allPlaces.length === 0) {
      return res
        .status(404)
        .json({ message: "Places are empty See:", allPlaces });
    }
    return res.status(200).json({ message: "got all", allPlaces });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE NEW PLACE
export const createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  const imagePath = req.file?.path;

  try {
    // Check if place already exists for this creator
    const existingPlace = await Place.findOne({ creator }).lean();
    if (existingPlace) {
      return res
        .status(400)
        .json({ success: false, message: "User already has a place" });
    }
    // Check if user exists (lean for performance)
    const userObj = await User.findById(creator);
    if (!userObj) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Transaction for place creation and user update
    const session = await mongoose.startSession();
    session.startTransaction();

    const newPlace = new Place({
      title,
      description,
      address,
      image: imagePath,
      creator,
    });
    await newPlace.save({ session });

    userObj.placesInUser.push(newPlace._id); // Store only the ID (best practice)
    await userObj.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Place created and assigned into user body as well",
      newPlace,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE SINGLE PLACE
export const updatePlace = async (req, res, next) => {
  const { id } = req.params;

  const { title, description, address } = req.body;
  const myImage = req.file?.path;

  const updateData = { title, description, address };
  if (myImage) {
    updateData.image = myImage;
  }

  console.log("Uploaded file path:", req.file?.path);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid place id" });
  }

  try {
    const myExistPlace = await Place.findById(id);
    if (!myExistPlace) {
      return res.status(404).json({ message: "not found place" });
    }
    const updatedPlace = await Place.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return res.status(200).json({ message: "Got you place", updatedPlace });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE ALL PLACES
export const deleteAllPlaces = async (req, res, next) => {
  await Place.deleteMany();
  return res
    .status(200)
    .json({ message: "all places are gone. Sorry about that!" });
};

// DELETE SINGLE PLACE
export const deletePlace = async (req, res, next) => {
  const placeId = req.params.id;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: "Invalid place ID format." });
  }

  try {
    // Populate creator field from place document
    const placeToDelete = await Place.findById(placeId).populate("creator");

    if (!placeToDelete) {
      return res.status(404).json({ message: "Place not found." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete place
      await placeToDelete.deleteOne({ session });

      // Remove reference from user's places array
      placeToDelete.creator.placesInUser.pull(placeId);

      // Save updated user with session
      await placeToDelete.creator.save({ session, validateBeforeSave: false });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ message: "Place deleted successfully." });
    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        success: false,
        message: "Transaction failed: " + transactionError.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};
