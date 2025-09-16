const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET api/friends/search
// @desc    Search users by name or email
// @access  Private
//tested with postman.
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    // If user has not written anything.
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        },
      ],
    })
      .select("-password")
      .limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/friends/follow/:userId
// @desc    Follow a user
// @access  Private
//Tested with postman.
router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent following yourself
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ msg: "Cannot follow yourself" });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ msg: "Already following this user" });
    }

    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ msg: "User followed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/friends/unfollow/:userId
// @desc    Unfollow a user
// @access  Private
//Tested with postman.
router.delete("/unfollow/:userId", auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ msg: "Not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== req.params.userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ msg: "User unfollowed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/friends/following
// @desc    Get list of users current user is following
// @access  Private
//Tested with postman.
router.get("/following", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("following", "-password")
      .select("following");

    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
