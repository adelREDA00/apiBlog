const mongoose = require("mongoose");
const Club = require("./Club");

const PlayerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: false,
      unique: false,
    },
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: false,
    },
    image_path: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", PlayerSchema);