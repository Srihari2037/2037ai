const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/dbConnect");

// 🔹 Load environment variables
dotenv.config();

// 🔹 Required environment variables check
const requiredEnvVars = [
  "MONGO_URI",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FRONTEND_URL",
];

const missingVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingVars.length > 0) {
  console.error(`❌ ERROR: Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// 🔹 Connect to MongoDB
connectDB();

const app = express();

// 🔹 Middleware
app.use(express.json()); // ✅ Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded requests

// 🔹 CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Restrict allowed methods
  })
);

// 🔹 Session Configuration (Stored in MongoDB)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set true for HTTPS
      httpOnly: true, // Prevents client-side access
      sameSite: "lax", // Prevents CSRF attacks
    },
  })
);

// 🔹 Passport Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport"); // Ensure passport config is loaded

// 🔹 Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));

// 🔹 Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server is running!" });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
