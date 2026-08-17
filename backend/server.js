const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const { protect } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("College Notes Sharing Portal API Running 🚀");
});

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route",
    user: req.user,
  });
});

module.exports = app;