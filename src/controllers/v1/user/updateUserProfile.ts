import logger from "@/lib/winston";
import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import config from "@/config";


const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  // get user body data
  const { firstName, lastName, profilePicture, bio, website, linkedin, instagram, x, username, role } = req.body;


  try {
    // get user from db with password
    const user = await User.findById(userId).select("+password -__v").exec();

    // check if user exists
    if (!user) {
      throw new ErrorHandler("User not found", 404, "updateUserProfile", "NotFound");
    }

    // check admin role if email is whitelisted
    if (role === "admin" && !config.WHITELISTED_ADMIN_EMAILS.includes(user.email)) {
      logger.warn(`User ${user.email} tried to update profile but is not whitelisted`);

      throw new ErrorHandler("You cannot update profile as an admin", 403, "updateUserProfile", "AuthorizationError");
    }

    // check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ username }).lean().exec();

      // check if username is already taken
      if (existingUser) {
        throw new ErrorHandler("Username already exists", 400, "updateUserProfile", "BadRequest");
      }

      // update username
      user.username = username;
    }

    // update user data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture) user.profilePicture = profilePicture;
    if (role) user.role = role;
    if (bio) user.bio = bio;
    if (website) user.website = website;
    if (!user.socialMedia) user.socialMedia = {};
    if (linkedin) user.socialMedia.linkedin = linkedin;
    if (instagram) user.socialMedia.instagram = instagram;
    if (x) user.socialMedia.x = x;
    // if (password) user.password = password; // hash password on pre save hook

    // save user
    await user.save();

    // send response
    res.json({
      success: true,
      status: "OK",
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default updateUserProfile;
