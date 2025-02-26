const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("❌ Missing required Google OAuth environment variables!");
}

// Determine the callback URL dynamically
const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_CALLBACK_URL_PROD
    : process.env.GOOGLE_CALLBACK_URL;

if (!callbackURL) {
  throw new Error("❌ Missing GOOGLE_CALLBACK_URL environment variable!");
}

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Handle missing fields gracefully
          const email = profile.emails?.[0]?.value || `no-email-${profile.id}@example.com`;
          const avatar = profile.photos?.[0]?.value || "https://default-avatar.com/avatar.png";

          user = new User({
            googleId: profile.id,
            name: profile.displayName || "Unknown User",
            email: email,
            avatar: avatar,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("❌ Deserialization Error:", error);
    done(error, null);
  }
});

module.exports = passport;
