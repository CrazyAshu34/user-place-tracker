import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  deleteAllUsers,
  updateUser,
} from "../controllers/usersController.mjs";

const router = express.Router();

router.route("/").post(createUser).get(getUsers).delete(deleteAllUsers);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
