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

// ✅ Protected routes

router.post("/add", upload.single("image"), checkAuth, createPlace);
router.patch("/update/:id", upload.single("image"), checkAuth, updatePlace);
router.delete("/:id", checkAuth, deletePlace);
router.delete("/", checkAuth, deleteAllPlaces);

export default router;
