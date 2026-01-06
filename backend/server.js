import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: "*", // change to frontend URL later
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ Mongo error:", err.message);
  });

/* ---------- Schema ---------- */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Invalid mobile number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "user",
    },
    addr: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate mobile race condition
userSchema.index({ mobile: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

/* ---------- JWT Middleware ---------- */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

/* ---------- Routes ---------- */

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { username, mobile, password, email, addr } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile and password are required",
      });
    }

    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await User.countDocuments();

    await User.create({
      username,
      mobile,
      email,
      addr,
      password: hashedPassword,
      role: count === 0 ? "admin" : "user",
    });

    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile and password are required",
      });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// PROFILE
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ROOT
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

/* ---------- Local Server ---------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

/* ---------- Required for Vercel ---------- */
export default app;
