const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// This ensures unique habit names per user
HabitSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Habit", HabitSchema);
