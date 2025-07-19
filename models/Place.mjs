import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { strict: "throw" }
);

export default mongoose.model("Place", placeSchema);
