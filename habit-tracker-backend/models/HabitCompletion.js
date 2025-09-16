const mongoose = require("mongoose");

const HabitCompletionSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    week: {
      type: Number, // Week number for weekly habits
    },
    year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique completions per day/week
HabitCompletionSchema.index(
  {
    habit: 1,
    completedAt: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      completedAt: { $exists: true },
    },
  }
);

module.exports = mongoose.model("HabitCompletion", HabitCompletionSchema);
