const bcrypt = require("bcryptjs");

// ✅ Hash password before saving
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// ✅ Compare passwords during login
const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = { hashPassword, comparePassword };
