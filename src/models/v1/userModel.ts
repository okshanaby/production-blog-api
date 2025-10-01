import { hashPassword } from "@/modules/authModule";
import { model, Schema } from "mongoose";

// Type ---------------------------------------------------------------
export type UserType = {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  profilePicture: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    x?: string;
    instagram?: string;
    linkedin?: string;
  };
};

// =========================================================================
// USER SCHEMA =============================================================
// =========================================================================
const userSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxLength: [20, "Username must be less than 20 characters"],
      minLength: [3, "Username must be greater than 3 characters"],
    },
    email: { type: String, required: [true, "Email is required"], unique: [true, "Email must be unique"] },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be greater than 8 characters"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: { values: ["admin", "user"], message: "{VALUE} is not supported" },
      default: "user",
    },
    firstName: { type: String, maxLength: [10, "First name must be less than 10 characters"] },
    lastName: { type: String, maxLength: [10, "Last name must be less than 10 characters"] },
    profilePicture: { type: String },
    bio: { type: String, maxLength: [200, "Bio must be less than 200 characters"] },
    website: { type: String, maxLength: [100, "Website must be less than 100 characters"] },
    socialMedia: {
      x: { type: String, maxLength: [100, "X must be less than 100 characters"] },
      instagram: { type: String, maxLength: [100, "Instagram must be less than 100 characters"] },
      linkedin: { type: String, maxLength: [100, "Linkedin must be less than 100 characters"] },
    },
  },
  { timestamps: true },
);

// Hash password on pre save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashPassword(this.password);

  next();
});

// Export model ----------------------------------------------------------
export default model<UserType>("User", userSchema);
