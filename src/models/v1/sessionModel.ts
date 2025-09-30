import { AUTH_CONSTANTS } from "@/constants";
import { model, Schema, Types } from "mongoose";

type SessionType = {
  userId: Types.ObjectId;
  token: string;
  ip: string;
  userAgent: string;
  device?: string;
  lastUsed: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

// =========================================================================
// SESSION SCHEMA ==========================================================
// =========================================================================
const sessionSchema = new Schema<SessionType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster user session lookups
    },
    token: {
      type: String,
      required: true,
      unique: true, // Ensure token uniqueness
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    device: {
      type: String,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_MS), // 7 days
      required: true,
    },
  },
  { timestamps: true },
);

// TTL index - auto-delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export model ----------------------------------------------------------
export default model<SessionType>("Session", sessionSchema);
