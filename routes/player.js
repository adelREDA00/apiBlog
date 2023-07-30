const router = require("express").Router();
const Player = require("../models/Player");
const {verifyAdmin} = require("../utils/verifytoken");
//creating new country


router.post("/", verifyAdmin, async (req, res) => {
  try {
    const playerData = req.body; // Assuming req.body contains an array of club objects

    const savedPlayers = await Player.create(playerData);
    res.status(200).json(savedPlayers);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/", async (req, res) => {
    try {
      const Players = await Player.find();
      res.status(200).json(Players);
    } catch (err) {
      res.status(500).json(err);
    }
  });

      //GET player
router.get("/:id", async (req, res) => {
  try {
    const Players = await Player.findById(req.params.id).populate('country_id');
    res.status(200).json(Players);
  } catch (err) {
    res.status(500).json(err);
  }
});

  //DELETE country
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
   
      try {
        await player.deleteOne({ _id: req.params.id });
        res.status(200).json(" player a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
   
  } catch (err) {
    res.status(500).json(err);
  }
});



router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const existingCountry = await Country.findById(req.params.id);
    if (!existingCountry) {
      return res.status(404).json({ error: "country not found" });
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCountry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete multiple country or delete all country
router.delete("/", verifyAdmin, async (req, res) => {
  const { playersIds } = req.body;
  try {
    // Delete multiple countries
    await Player.deleteMany({ _id: { $in: playersIds } });
    res.status(200).json("Player have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});


  // GET total number of categories
  router.get("/count", async (req, res) => {
    try {
      const count = await Country.countDocuments();
      console.log(count);
      res.status(200).json({ count });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;