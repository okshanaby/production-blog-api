import config from "@/config";
import ErrorHandler from "@/utils/errorHandler";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import logger from "./winston";

// Check if Cloudinary configuration is defined
if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration is not defined in the configuration");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary
export const uploadToCloudinary = (buffer: Buffer, publicId: string): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",
        folder: "blog-api",
        transformation: { quality: "auto" },
      },
      (error, result) => {
        if (error) {
          logger.error("Error uploading to Cloudinary", error);
          reject(error);
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new ErrorHandler(
        `Cloudinary deletion failed: ${JSON.stringify(result)}`,
        500,
        "deleteFromCloudinary",
        "InternalServerError",
        result,
      );
    }
  } catch (error) {
    logger.error("Error deleting from Cloudinary:", error);
    throw new ErrorHandler("Error deleting from Cloudinary", 500, "deleteFromCloudinary", "InternalServerError", error);
  }
};

// export const deleteManyFromCloudinary = async (publicIds: string[]): Promise<void> => {
//   try {
//     const result = await cloudinary.api.delete_resources(publicIds);

//     // Check if any deletion failed
//     const failed = Object.values(result.deleted).some(
//       status => status !== "deleted" && status !== "not found"
//     );

//     if (failed) {
//       throw new ErrorHandler(
//         `Cloudinary deletion failed for some assets: ${JSON.stringify(result)}`,
//         500,
//         "deleteManyFromCloudinary",
//         "InternalServerError",
//         result,
//       );
//     }

//     logger.info(`Successfully deleted assets: ${publicIds.join(", ")}`);
//   } catch (error) {
//     logger.error("Error deleting from Cloudinary:", error);
//     throw new ErrorHandler(
//       "Error deleting from Cloudinary",
//       500,
//       "deleteManyFromCloudinary",
//       "InternalServerError",
//       error,
//     );
//   }
// };

export const deleteManyFromCloudinary = async (publicIds: string[]): Promise<void> => {
  try {
    const chunkSize = 100;

    // delete assets in chunks of 100 at a time, since cloudinary has a limit of 100 assets per request
    for (let i = 0; i < publicIds.length; i += chunkSize) {
      const chunk = publicIds.slice(i, i + chunkSize);
      logger.info(`Deleting Cloudinary assets ${i + 1} to ${i + chunk.length} of ${publicIds.length}...`);

      const result = await cloudinary.api.delete_resources(chunk);

      // Check if any deletion failed
      const failed = Object.values(result.deleted).some(
        status => status !== "deleted" && status !== "not found"
      );

      if (failed) {
        throw new ErrorHandler(
          `Cloudinary deletion failed for some assets in chunk ${i / chunkSize + 1}: ${JSON.stringify(result)}`,
          500,
          "deleteManyFromCloudinary",
          "InternalServerError",
          result,
        );
      }

      logger.info(`✅ Successfully deleted chunk ${i / chunkSize + 1} (${chunk.length} assets)`);
    }

    logger.info(`✅ All ${publicIds.length} Cloudinary assets deleted successfully`);
  } catch (error) {
    logger.error("❌ Error deleting from Cloudinary:", error);
    throw new ErrorHandler(
      "Error deleting from Cloudinary",
      500,
      "deleteManyFromCloudinary",
      "InternalServerError",
      error,
    );
  }
};
