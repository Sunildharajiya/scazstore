
import express from "express";
import { authenticate } from "../../middleware/authentication.js";
import { User } from "../../db/models/users.model.js";

export const userProfile = express.Router();

userProfile.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select(
        "_id firstName LastName userName email mobile role secondryMobile"
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        user: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      user,
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      user: null,
    });
  }
});
