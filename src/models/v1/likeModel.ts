import { model, Schema, Types } from "mongoose";

type LikeType = {
  userId: Types.ObjectId;
  blogPostId: Types.ObjectId;
  commentId?: Types.ObjectId;
};

const likeSchema = new Schema<LikeType>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blogPostId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
});

export default model<LikeType>("Like", likeSchema);