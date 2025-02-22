require("dotenv").config();
const generateToken = require("./utils/jwtHelper");
const { hashPassword, comparePassword } = require("./utils/encryptHelper");

// ✅ Test JWT Token Generation & Verification
const testJWT = () => {
  const userId = "1234567890abcdef"; // Sample user ID
  const token = generateToken(userId);
  
  console.log("Generated JWT Token:", token);
};

// ✅ Test Password Hashing & Comparison
const testPasswordHashing = async () => {
  const password = "SecurePass123!";
  const hashedPassword = await hashPassword(password);
  
  console.log("Original Password:", password);
  console.log("Hashed Password:", hashedPassword);

  // Verify Password
  const isMatch = await comparePassword(password, hashedPassword);
  console.log("Password Match:", isMatch ? "✅ Success" : "❌ Failed");
};

// Run tests
testJWT();
testPasswordHashing();
