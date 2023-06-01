const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {verifyToken} = require("../utils/verifytoken");


//REGISTER
router.post("/register", async (req, res) => {
  try {
    //encrypte the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).send("L'utilisateur a été créé..");
    //res.status(200).json(user);

  } catch (err) {
    res.status(500).send("Le nom d'utilisateur ou l'adresse e-mail est déjà utilisé(e).");
  }
});


//LOGIN


  router.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;
   //getting the user by name
    const user = await User.findOne({ username });

    if (!user) {
      const errorMessage = "Nom d'utilisateur incorrect. Veuillez vérifier et réessayer.";
      return res.status(400).json(errorMessage);
    }

    const validated = await bcrypt.compare(password, user.password);
     //comparing the user pw
    if (!validated) {
      const errorMessage = "Mot de passe incorrect. Veuillez réessayer";
      return res.status(400).json(errorMessage);
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin },   process.env.JWT);

    //returning the user exept the pw & admin status
    const { password: userPassword, ...others } = user._doc;

    return res.cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ token: token, ...others });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;