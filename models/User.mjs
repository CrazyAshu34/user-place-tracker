import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  places: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
});

export default mongoose.model("User", userSchema);
