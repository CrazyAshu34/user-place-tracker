import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  deleteUser,
} from "../controllers/usersController.mjs";

const router = express.Router();

router.route("/").post(createUser).get(getUsers);
router.route("/:id").get(getUser).delete(deleteUser);

export default router;
