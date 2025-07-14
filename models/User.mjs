import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    placesInUser: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
  },
  { strict: "throw" }
);

export default mongoose.model("User", userSchema);
