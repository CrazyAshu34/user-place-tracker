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

    const newPlace = new Place({ title, description, address, creator });
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
  const newData = req.body;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid place id" });
  }
  try {
    const myExistPlace = await Place.findById(id);
    if (!myExistPlace) {
      return res.status(404).json({ message: "not found place" });
    }
    const updatedPlace = await Place.findByIdAndUpdate(id, newData, {
      new: true,
    });
    return res.status(200).json({ message: "Got you place", updatedPlace });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE SINGLE PLACE
export const deletePlace = async (req, res, next) => {
  const placeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: "Invalid place id" });
  }
  try {
    const D_place = await Place.findById(placeId).populate("creator");
    if (!D_place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await D_place.deleteOne({ session });
    D_place.creator.placesInUser.pull(placeId);
    await D_place.creator.save({ session }); // <-- yahan await lagao

    await session.commitTransaction();
    session.endSession(); // <-- yahan await mat lagao

    return res.status(200).json({ message: "Place deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE ALL PLACES
export const deleteAllPlaces = async (req, res, next) => {
  await Place.deleteMany();
  return res
    .status(200)
    .json({ message: "all places are gone. Sorry about that!" });
};
