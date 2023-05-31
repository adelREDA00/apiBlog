const router = require("express").Router();
const League = require("../models/champions");
const {verifyAdmin} = require("../utils/verifytoken");

//creating new cat
router.post("/",verifyAdmin, async (req, res) => {
  const newLeague = new League(req.body);
  try {
    const savedLeague = await newLeague.save();
    res.status(200).json(savedLeague);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/",async (req, res) => {
    try {
      const league = await League.find();
      res.status(200).json(league);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //DELETE League
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
   
      try {
        await league.deleteOne({ _id: req.params.id });
        res.status(200).json("La league a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
   
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const existingLeague = await League.findById(req.params.id);
    if (!existingLeague) {
      return res.status(404).json({ error: "country not found" });
    }

    const updatedCountry = await League.findByIdAndUpdate(
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





// Delete multiple League or delete all League
router.delete("/", verifyAdmin, async (req, res) => {
  const { leagueIds } = req.body;
  try {
    // Delete multiple League
    await League.deleteMany({ _id: { $in: leagueIds } });
    res.status(200).json("clubs have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;