import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import placeRoutes from "./routes/placeRoutes.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Workaround for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import HttpError from "./models/httpError.mjs";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
// cors
app.use(cors());

// Body parser
app.use(express.json());

// create folder if not
if (!fs.existsSync("uploads/images")) {
  fs.mkdirSync("uploads/images", { recursive: true });
}

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads/images"))
);

// Routes
app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

// // Error handler
// app.use((req, res, next) => {
//   next(new HttpError("Route not found", 404));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
