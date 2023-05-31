const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tags", TagsSchema);