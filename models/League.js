const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: false,
      unique: false,
    },
    country_id: {
      type: Number,
      required: false,
      unique: false,
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

module.exports = mongoose.model("League", LeagueSchema);