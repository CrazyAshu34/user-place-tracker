import express from "express";
import {
  signup,
  getUsers,
  login,
  getUser,
  deleteUser,
  deleteAllUsers,
  updateUser,
} from "../controllers/usersController.mjs";
import checkAuth from "../middleware/checkAuth.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.use(checkAuth);

router.get("/", getUsers);
router.delete("/", deleteAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
