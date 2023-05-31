const router = require("express").Router();
const Country = require("../models/pays");
const {verifyAdmin} = require("../utils/verifytoken");
//creating new country
router.post("/",verifyAdmin, async (req, res) => {
  const newCountry = new Country(req.body);
  try {
    const savedCountry = await newCountry.save();
    res.status(200).json(savedCountry);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
    try {
      const tags = await Country.find();
      res.status(200).json(tags);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //DELETE country
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
   
      try {
        await country.deleteOne({ _id: req.params.id });
        res.status(200).json(" country a été supprimé..");
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
  const { countryIds } = req.body;
  try {
    // Delete multiple countries
    await Country.deleteMany({ _id: { $in: countryIds } });
    res.status(200).json("countries have been deleted.");
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