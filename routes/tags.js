const router = require("express").Router();
const Tag = require("../models/Tags");
const {verifyAdmin} = require("../utils/verifytoken");
//creating new cat
router.post("/",verifyAdmin, async (req, res) => {
  const newTag = new Tag(req.body);
  try {
    const savedTag = await newTag.save();
    res.status(200).json(savedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
    try {
      const tags = await Tag.find();
      res.status(200).json(tags);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //DELETE club
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
   
      try {
        await tag.deleteOne({ _id: req.params.id });
        res.status(200).json(" tag a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
   
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const existingTag = await Tag.findById(req.params.id);
    if (!existingTag) {
      return res.status(404).json({ error: "tag not found" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete multiple clubs or delete all clubs
router.delete("/", verifyAdmin, async (req, res) => {
  const { tagsIds } = req.body;
  try {
    // Delete multiple categories
    await Tag.deleteMany({ _id: { $in: tagsIds } });
    res.status(200).json("Tags have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;