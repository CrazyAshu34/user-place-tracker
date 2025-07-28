import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const checkAuth = (req, res, next) => {
  if (res.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
    if (!token)
      return res.status(401).json({ error: "Authentication failed!" });
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export default checkAuth;
