const router = require("express").Router();
const Category = require("../models/Category");
const {verifyAdmin} = require("../utils/verifytoken");

//creating new cat
router.post("/",verifyAdmin, async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE Category
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
   
      try {
        await cat.deleteOne({ _id: req.params.id });
        res.status(200).json("Le category a été supprimé..");
      } catch (err) {
        res.status(500).json(err);
      }
   
  } catch (err) {
    res.status(500).json(err);
  }
});




router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Delete multiple categories or delete all categories
router.delete("/", verifyAdmin, async (req, res) => {
  const { categoryIds } = req.body;
  try {
    // Delete multiple categories
    await Category.deleteMany({ _id: { $in: categoryIds } });
    res.status(200).json("The categories have been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});



//get all categroys
router.get("/", async (req, res) => {
    try {
      const cats = await Category.find();
      res.status(200).json(cats);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  



module.exports = router;