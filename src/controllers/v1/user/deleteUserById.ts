import { deleteManyFromCloudinary } from "@/lib/cloudinary";
import Blog from "@/models/v1/blogModel";
import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

// ============================================================================
// DELETE USER BY ID CONTROLLER ==================================================
// ============================================================================
const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    // get all user blogs
    const userBlogs = await Blog.find({ author: userId }).lean().exec();

    if (userBlogs.length > 0) {
      // delete all user blogs assets from cloudinary
      const blogPublicIds = userBlogs.map((blog) => blog.banner.publicId);
      await deleteManyFromCloudinary(blogPublicIds);

      // delete all user blogs
      await Blog.deleteMany({ author: userId }).exec();
    }

    // TODO: delete all user likes
    // TODO: delete all user comments

    // TODO: delete all user sessions

    // delete user from db
    await User.deleteOne({ _id: userId }).exec();

    // send response
    res.json({
      success: true,
      status: "OK",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteUserById;
