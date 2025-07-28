import express from "express";
import upload from "../middleware/fileUpload.mjs";
import {
  createPlace,
  getPlaces,
  deleteAllPlaces,
  getPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.mjs";
import checkAuth from "../middleware/checkAuth.mjs";

const router = express.Router();

// ❌ Public routes
router.get("/", getPlaces);
router.get("/:id", getPlace);

// ✅ Protected routes (checkAuth comes first)
router.post("/add", checkAuth, upload.single("image"), createPlace);
router.patch("/update/:id", checkAuth, upload.single("image"), updatePlace);
router.delete("/:id", checkAuth, deletePlace);
router.delete("/", checkAuth, deleteAllPlaces);

export default router;
