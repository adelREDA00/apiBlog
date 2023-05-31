const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const {verifyUser,verifyAdmin} = require("../utils/verifytoken");


//UPDATE  
router.put("/:id",verifyUser, async (req, res) => {

    //if the user change the pw we encrypt it 
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
       //find the user by id and update it 
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        //set to true so mongoose send re with the updated user 
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }

});


//DELETE
router.delete("/:id",verifyUser, async (req, res) => {
    try {
      //find the user by id
      const user = await User.findById(req.params.id);
      try {
        //check all the user posts by username and delete them  
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("L'utilisateur a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("Utilisateur non trouvé !");
    }
   
});


// Delete multiple League or delete all League
router.delete("/", verifyAdmin, async (req, res) => {
  const { usersIds } = req.body;
  console.log(usersIds);
  try {
    // Delete multiple League
    await User.deleteMany({ _id: { $in: usersIds } });
    res.status(200).json("users have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});





//GET USER
router.get("/:id",verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Utilisateur n'existe pas");
  }
});



//GET ALL users
router.get("/",verifyAdmin , async (req, res) => {
  try {
    let users = await User.find();

    res.status(200).json(users);

  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;