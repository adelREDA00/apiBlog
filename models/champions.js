const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("League", LeagueSchema);