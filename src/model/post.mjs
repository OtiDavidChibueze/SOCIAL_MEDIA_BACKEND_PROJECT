// POST SCHEMA
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PostSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
    like: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    liked: {
      type: Array,
      default: [],
    },
    disliked: {
      type: Array,
      default: [],
    },
    comments: [
      {
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamp: true }
);

//PLUGIN PAGINATE
PostSchema.plugin(mongoosePaginate);

// CREATE A MODEL
const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
