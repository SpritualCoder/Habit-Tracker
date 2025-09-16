const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
// app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  "https://habit-tracker-xi-two.vercel.app/", // replace with your actual Vercel domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-auth-token"],
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
