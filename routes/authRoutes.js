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

//Update the user profile

router.post("/updateProfile", async (req, res) => {
  try {
    const { userId, name, handle, email, phone, links, accountStatus } =
      req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (handle !== undefined) updateFields.handle = handle;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (Array.isArray(links)) updateFields.links = links;
    if (accountStatus !== undefined) updateFields.accountStatus = accountStatus;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
