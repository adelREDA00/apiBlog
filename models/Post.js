const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: Array,
      required: false,
    },
    video: {
      type: Array,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    club: {
      type: String,
      required: false,
    },
    categories: {
      type: Array,
      required: false,
    },
    tags: {
        type: Array,
        required: false,
      },
    country: {
        type: Array,
        required: false,
      },
    league: {
        type: Array,
        required: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);