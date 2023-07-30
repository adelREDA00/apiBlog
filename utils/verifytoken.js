const jwt = require('jsonwebtoken');
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }

  const tokenValue = token.split(" ")[1]; // Extract the token value after "Bearer "

  jwt.verify(tokenValue, process.env.JWT, (err, user) => {
    if (err) {
      return res.status(401).json("Invalid token!");
    }
    req.user = user;
    next();
  });
};


const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params._id   || req.user.isAdmin) {
      next();
    } else {
      return res.status(400).json("You can only update ur account!");
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(400).json("You are not an admin!");
    }
  });
};









module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
};
