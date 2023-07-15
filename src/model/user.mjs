// USER SCHEMA
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
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
    followersCount: {
      type: Number,
      default: 0,
      min: 0
    },
    following: {
      type: Array,
      default: [],
    },
    followingCounts: {
      type: Number,
      default: 0,
      min: 0
    },
    phone_number: {
      type: String,
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
    isAdmin: {
      type: Boolean,
      default: false
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
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
  { timestamps: true }
);

//PLUGIN PAGINATE
UserSchema.plugin(mongoosePaginate);

// CREATE A MODEL
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
