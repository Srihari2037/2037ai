const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/dbConnect");

// 🔹 Load environment variables
dotenv.config();

// 🔹 Check for required environment variables (but don't exit process)
const requiredEnvVars = [
  "MONGO_URI",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FRONTEND_URL",
];

const missingVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingVars.length > 0) {
  console.warn(`⚠️ Warning: Missing environment variables: ${missingVars.join(", ")}`);
}

// 🔹 Connect to MongoDB
connectDB();

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Allow frontend or fallback to all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 🔹 Session Configuration (Stored in MongoDB)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret", // Ensure a default in dev mode
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      autoRemove: "interval",
      autoRemoveInterval: 10, // Removes expired sessions every 10 minutes
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure in production
      httpOnly: true,
      sameSite: "lax",
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
  res.status(200).json({ message: "✅ 2037AI Backend is running!" });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
