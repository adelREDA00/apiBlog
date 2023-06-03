const mongoose = require("mongoose");
const Club = require("./Club");
const Category = require("./Category");
const Country = require("./Country");
const League = require("./League");
const Player = require("./Player");
const NatClub = require("./NatClub");
const Post = require("./Post");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    leagues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League",
      },
    ],
    countries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
    ],
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
      postBookMark: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    natclubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NatClub",
      },
    ],
    player: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
