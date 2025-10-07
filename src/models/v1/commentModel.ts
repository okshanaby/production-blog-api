import { model, Schema, Types } from "mongoose";

export type CommentType = {
  userId: Types.ObjectId;
  blogPostId: Types.ObjectId;
  content: string;
};

const commentSchema = new Schema<CommentType>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blogPostId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  content: { type: String, required: true, maxLength: [500, "Content must be less than 500 characters"] },
});

export default model<CommentType>("Comment", commentSchema);
