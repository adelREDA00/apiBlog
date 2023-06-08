const mongoose = require("mongoose");
const User = require("./User");
const Club = require("./Club");
const Category = require("./Category");
const Tags = require("./Tags");
const Country = require("./Country");
const League = require("./League");
const Player = require("./Player");
const NatClub = require("./NatClub");

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
      type: String,
      required: true,
    },
    video: {
      type: Array,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: false,
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tags",
      default: [],
    }],
    natclub: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "NatClub",
      default: [],
    }],
    player: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: [],
    }],
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: false,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
