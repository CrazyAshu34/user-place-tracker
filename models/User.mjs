import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      minlength: 3,
      maxlength: 50,
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 3,
    },
    placesInUser: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
  },
  { strict: "throw" }
);

export default mongoose.model("User", userSchema);
