const mongoose = require("mongoose");

const NatclubsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NatClub", NatclubsSchema);