import { UPLOAD_CONSTANTS } from "@/constants";
import { uploadToCloudinary } from "@/lib/cloudinary";
import logger from "@/lib/winston";
import Blog from "@/models/v1/blogModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

// Memory storage
const storage = multer.memoryStorage();

// File filter: only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith("image/")) {
    // The first argument must be null or undefined for an error, and the second is false to reject the file
    return cb(null, false);
  }
  cb(null, true);
};

// Max file size: 2MB
const limits = {
  fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
};

export const upload = multer({ storage, fileFilter, limits });

const uploadBlogBanner = (method: "post" | "put") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === "put" && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      throw new ErrorHandler("Banner image is required", 400, "uploadBlogBanner", "InputValidationError");
    }

    if (req.file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      throw new ErrorHandler("Banner image must be less than 2MB", 413, "uploadBlogBanner", "InputValidationError");
    }

    try {
      // this is for updating the blog post banner
      const { blogPostId } = req.params;
      const blogPost = await Blog.findById(blogPostId).lean().exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        blogPost?.banner.publicId.replace("blog-api/", ""),
      );

      if (!data) {
        logger.error("Failed to upload banner image");
        throw new ErrorHandler("Failed to upload banner image", 500, "uploadBlogBanner", "InternalServerError");
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      req.body.banner = newBanner;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default uploadBlogBanner;
