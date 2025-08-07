import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

{
  /*Register new user*/
}
router.post("/register", async (req, res) => {
  const { name, handle, email, password, phone } = req.body;
  console.log(name, handle, email, password, phone);
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds
      user = new User({ name, handle, email, password: hashedPassword, phone });
      await user.save();
    }

    res.status(200).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/* Login user with email */
router.post("/login", async (req, res) => {
  const { handle, password } = req.body;

  try {
    const user = await User.findOne({ handle }); // match by email
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
router.post("/updateProfile", async (req, res) => {
  try {
    const { userId, links } = req.body;

    if (!userId || !Array.isArray(links)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { links }, // replaces links array entirely
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser); // Send updated user to frontend
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
