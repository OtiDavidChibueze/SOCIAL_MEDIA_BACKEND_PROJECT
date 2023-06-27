// USER SCHEMA
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },

    phone_number: {
      type: Number,
    },
    profile_pics: {
      type: String,
    },
    cover_pics: {
      type: String,
    },
    posts: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["user ", "isAdmin", "isSuperAdmin"],
      default: "user",
    },
    desc: {
      type: String,
    },
    city: {
      type: String,
    },
    from: {
      type: String,
    },
    relationship: {
      type: String,
      enum: [
        "single",
        "married",
        "divorced",
        "complicated",
        "engaged",
        "in a relationship",
      ],
      default: "single",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiresAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamp: true }
);

//PLUGIN PAGINATE
UserSchema.plugin(mongoosePaginate);

// CREATE A MODEL
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
