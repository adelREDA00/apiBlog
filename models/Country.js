const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Country", CountrySchema);