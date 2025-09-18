const express = require("express");
const { body, validationResult } = require("express-validator");
const Habit = require("../models/Habit");
const HabitCompletion = require("../models/HabitCompletion");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET api/habits
// @desc    Get all habits for the current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habitsWithCompletions = await Promise.all(
      habits.map(async (habit) => {
        let existingCompletion;

        if (habit.frequency === "daily") {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          existingCompletion = await HabitCompletion.findOne({
            habit: habit._id,
            completedAt: { $gte: today, $lt: tomorrow },
          });
        } else if (habit.frequency === "weekly") {
          const currentWeek = getWeekNumber(today);

          existingCompletion = await HabitCompletion.findOne({
            habit: habit._id,
            week: currentWeek,
            year: today.getFullYear(),
          });
        }

        return {
          ...habit.toObject(),
          completed: !!existingCompletion,
        };
      })
    );

    res.json({ habits: habitsWithCompletions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/habits
// @desc    Create a new habit
// @access  Private
//Checked all edge cases with postman.
router.post(
  "/",
  [
    auth,
    body("name", "Name is required").not().isEmpty(),
    body("category", "Category is required").not().isEmpty(),
    body("frequency", "Frequency must be daily or weekly").isIn([
      "daily",
      "weekly",
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, frequency } = req.body;

      // Check if habit with same name already exists for this user
      const existingHabit = await Habit.findOne({
        user: req.user.id,
        name: name.trim(),
      });

      if (existingHabit) {
        return res
          .status(400)
          .json({ msg: "Habit with this name already exists" });
      }

      const newHabit = new Habit({
        user: req.user.id,
        name: name.trim(),
        category: category.trim(),
        frequency,
      });

      const habit = await newHabit.save();
      res.json(habit);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/habits/:id
// @desc    Get a single habit by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json({ habit });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/habits/:id
// @desc    Update a habit
// @access  Private
//Checked all edge cases with postman.
router.put(
  "/:id",
  [
    auth,
    body("name", "Name is required").not().isEmpty(),
    body("category", "Category is required").not().isEmpty(),
    body("frequency", "Frequency must be daily or weekly").isIn([
      "daily",
      "weekly",
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, frequency } = req.body;

      let habit = await Habit.findById(req.params.id);

      if (!habit) {
        return res.status(404).json({ msg: "Habit not found" });
      }

      // Make sure user owns habit
      if (habit.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      // Check if habit with same name already exists (excluding current habit)
      const existingHabit = await Habit.findOne({
        user: req.user.id,
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingHabit) {
        return res
          .status(400)
          .json({ msg: "Habit with this name already exists" });
      }

      habit.name = name.trim();
      habit.category = category.trim();
      habit.frequency = frequency;

      await habit.save();
      res.json(habit);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/habits/:id
// @desc    Delete a habit
// @access  Private
//Checked all edge cases with postman.
router.delete("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: "Habit not found" });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete all completions for this habit
    await HabitCompletion.deleteMany({ habit: req.params.id });

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ msg: "Habit removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/habits/:id/complete
// @desc    Mark habit as complete
// @access  Private
//Checked all edge cases with postman.
router.post("/:id/complete", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: "Habit not found" });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // COMPLETION CHECK
    let existingCompletion;

    if (habit.frequency === "daily") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      existingCompletion = await HabitCompletion.findOne({
        habit: req.params.id,
        completedAt: { $gte: today, $lt: tomorrow },
      });
    } else if (habit.frequency === "weekly") {
      const currentWeek = getWeekNumber(today);
      existingCompletion = await HabitCompletion.findOne({
        habit: req.params.id,
        week: currentWeek,
        year: today.getFullYear(),
      });
    }

    if (existingCompletion) {
      return res
        .status(400)
        .json({ msg: "Habit already completed for this period" });
    }

    // CREATE COMPLETION
    const completion = new HabitCompletion({
      habit: req.params.id,
      user: req.user.id,
      completedAt: new Date(),
      year: today.getFullYear(),
    });

    if (habit.frequency === "weekly") {
      completion.week = getWeekNumber(today);
    }

    await completion.save();

    // UPDATE STATS
    habit.totalCompletions += 1;

    // STREAK LOGIC
    if (habit.frequency === "daily") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const yesterdayCompletion = await HabitCompletion.findOne({
        habit: req.params.id,
        completedAt: { $gte: yesterday, $lte: yesterdayEnd },
      });

      habit.currentStreak = yesterdayCompletion ? habit.currentStreak + 1 : 1;
    } else if (habit.frequency === "weekly") {
      const thisWeek = getWeekNumber(today);
      const lastWeek = thisWeek - 1;

      const lastWeekCompletion = await HabitCompletion.findOne({
        habit: req.params.id,
        week: lastWeek,
        year: today.getFullYear(),
      });

      habit.currentStreak = lastWeekCompletion ? habit.currentStreak + 1 : 1;
    }

    // UPDATE LONGEST STREAK
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    await habit.save();

    res.json({ msg: "Habit marked as complete", habit, completion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Helper function to get ISO week number
function getWeekNumber(date) {
  const firstThursday = new Date(date.getFullYear(), 0, 1);
  while (firstThursday.getDay() !== 4) {
    firstThursday.setDate(firstThursday.getDate() + 1);
  }
  const week = Math.ceil(
    ((date - firstThursday) / 86400000 + firstThursday.getDay() + 1) / 7
  );
  return week;
}

module.exports = router;
