const router = require("express").Router();
const Club = require("../models/Club");
const {verifyAdmin} = require("../utils/verifytoken");


//creatiing new club
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const clubsData = req.body; // Assuming req.body contains an array of club objects

    const savedClubs = await Club.create(clubsData);
    res.status(200).json(savedClubs);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all the culbs
router.get("/", async (req, res) => {
    try {
      const clubs = await Club.find();
      res.status(200).json(clubs);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
//DELETE club
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
   
      try {
        await club.deleteOne({ _id: req.params.id });
        res.status(200).json("Le club a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
   
  } catch (err) {
    res.status(500).json(err);
  }
});


// Delete multiple clubs or delete all clubs
router.delete("/", verifyAdmin, async (req, res) => {
  const { clubsIds } = req.body;
  try {
    // Delete multiple categories
    await Club.deleteMany({ _id: { $in: clubsIds } });
    res.status(200).json("clubs have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const existingClub = await Club.findById(req.params.id);
    if (!existingClub) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedClub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


  //GET club
router.get("/:id", async (req, res) => {
    try {
      const club = await Club.findById(req.params.id);
      res.status(200).json(club);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // GET total number of categories
router.get("/count", async (req, res) => {
  try {
    const count = await Club.countDocuments();
    console.log(count);
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json(err);
  }
});
  
module.exports = router;