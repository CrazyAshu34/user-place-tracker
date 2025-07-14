import express from "express";
import {
  createPlace,
  getPlaces,
  deleteAllPlaces,
  getPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.mjs";

const router = express.Router();

// router.get("/", getPlaces);
router.route("/").post(createPlace).get(getPlaces).delete(deleteAllPlaces);

router.route("/:id").get(getPlace).patch(updatePlace).delete(deletePlace);

export default router;
