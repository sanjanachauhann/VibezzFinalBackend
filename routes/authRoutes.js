import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, handle, email, password, phone } = req.body;
  console.log(name, handle, email, password, phone);
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ name, handle, email, password, phone });
      await user.save();
    }

    res.status(200).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
