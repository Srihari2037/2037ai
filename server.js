const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/dbConnect");

// Load environment variables
dotenv.config();

// Required environment variables check
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

async function createServer() {
  await connectDB();

  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Passport configuration
  require("./config/passport");

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Mount API routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/leads", require("./routes/leadRoutes"));

  // Health Check Route
  app.get("/", (req, res) => res.send("✅ 2037AI Backend Running!"));

  // Check if user is authenticated
  app.get("/api/auth/user", (req, res) => {
    return req.isAuthenticated()
      ? res.json(req.user)
      : res.status(401).json({ message: "Unauthorized - Please log in" });
  });

  // 404 Error Handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

createServer()
  .then((app) => {
    if (!process.env.VERCEL) {
      // Running locally: start the server
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () =>
        console.log(`✅ Server running on port ${PORT}`)
      );

      process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        server.close(() => process.exit(1));
      });
      process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
        server.close(() => process.exit(1));
      });
    } else {
      // On Vercel: export the app as a serverless function
      module.exports = app;
    }
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB or start server:", error);
    process.exit(1);
  });
