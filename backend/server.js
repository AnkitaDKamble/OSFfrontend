import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { sendOTP } from "./sendOTP.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// ---------- MongoDB ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("Mongo error:", err));

// ---------- Schemas ----------
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  mobile: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  addr: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ---------- JWT Middleware ----------
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ---------- Signup ----------
app.post("/api/signup", async (req, res) => {
  try {
    const { username, mobile, password, email, addr } = req.body;
    if (!username || !mobile || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ mobile });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const count = await User.countDocuments();

    await User.create({
      username,
      mobile,
      email,
      addr,
      password: hashed,
      role: count === 0 ? "admin" : "user",
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- Login ----------
app.post("/api/login", async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) return res.status(401).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid login" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
});

// ---------- Profile ----------
app.get("/api/profile", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ---------- Start ----------
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
