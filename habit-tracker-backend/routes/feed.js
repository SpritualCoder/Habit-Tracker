const express = require("express");
const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitCompletion = require("../models/HabitCompletion");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET api/feed
// @desc    Get activity feed of followed users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.following || currentUser.following.length === 0) {
      return res.json([]);
    }

    // Get recent completions from followed users
    const recentCompletions = await HabitCompletion.find({
      user: { $in: currentUser.following },
    })
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "habit",
        select: "name category currentStreak",
      })
      .sort({ completedAt: -1 })
      .limit(50);

    res.json(recentCompletions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/feed/leaderboard
// @desc    Get leaderboard of users by streaks
// @access  Private
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get all users (following + current user)
    const userIds = [...currentUser.following, req.user.id];

    const leaderboard = await Habit.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: "$user",
          maxStreak: { $max: "$currentStreak" },
          totalHabits: { $sum: 1 },
          totalCompletions: { $sum: "$totalCompletions" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          maxStreak: 1,
          totalHabits: 1,
          totalCompletions: 1,
        },
      },
      { $sort: { maxStreak: -1, totalCompletions: -1 } },
      { $limit: 10 },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
