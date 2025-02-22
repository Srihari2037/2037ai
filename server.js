const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/dbConnect");

// Load environment variables
dotenv.config();

// Validate required environment variables
if (
  !process.env.MONGO_URI ||
  !process.env.SESSION_SECRET ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET
) {
  console.error("❌ ERROR: Missing environment variables! Check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
connectDB()
  .then(() => {
    const app = express();

    // Passport configuration (make sure this file exists and is correct)
    require("./config/passport");

    // CORS configuration – allow frontend requests
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Middleware to parse JSON and URL-encoded requests
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configure sessions stored in MongoDB
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
      })
    );

    // Initialize Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // ✅ FIXED: Mount API routes properly
    const authRoutes = require("./routes/authRoutes");
    app.use("/api/auth", authRoutes);

    const leadRoutes = require("./routes/leadRoutes"); // ✅ Match the actual filename
app.use("/api/leads", leadRoutes);


    // Health Check Route
    app.get("/", (req, res) => res.send("✅ 2037AI Backend Running!"));

    // Optionally, check if a user is logged in:
    app.get("/api/auth/user", (req, res) => {
      if (req.isAuthenticated()) {
        return res.json(req.user);
      }
      res.status(401).json({ message: "Unauthorized - Please log in" });
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  });
