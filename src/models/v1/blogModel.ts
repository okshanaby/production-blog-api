import { model, Schema, Types } from "mongoose";
import slugify from "slugify";

export type BlogType = {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
};

const blogSchema = new Schema<BlogType>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxLength: [100, "Title must be less than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      maxLength: [150, "Slug must be less than 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxLength: [5000, "Content must be less than 5000 characters"],
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Author is required"] },
    banner: {
      publicId: {
        type: String,
        required: [true, "Public ID is required"],
        maxLength: [100, "Public ID must be less than 100 characters"],
      },
      url: {
        type: String,
        required: [true, "URL is required"],
        maxLength: [200, "URL must be less than 200 characters"],
      },
      width: {
        type: Number,
        required: [true, "Width is required"],
        maxLength: [5, "Width must be less than 5 characters"],
      },
      height: {
        type: Number,
        required: [true, "Height is required"],
        maxLength: [5, "Height must be less than 5 characters"],
      },
    },
    isPublished: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

blogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    return next();
  }
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

export default model<BlogType>("Blog", blogSchema);
