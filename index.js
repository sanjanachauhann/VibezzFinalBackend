import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import axios from "axios";

dotenv.config(); // Load environment variables

const app = express(); // ✅ Initialize app before using it

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start server
app.listen(8080, () => console.log("Server running on port 8080"));

app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5000/predict", {
      input: req.body.input,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Prediction service failed" });
  }
});
