const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
// app.use(cors());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());

// Define Routes
app.use("/api/auth", require("./routes/auth")); //Tested
app.use("/api/habits", require("./routes/habits")); //Tested
app.use("/api/friends", require("./routes/friends")); //Tested
app.use("/api/feed", require("./routes/feed.js"));

app.get("/", (req, res) => {
  res.json({ message: "Habit Tracker API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
