const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const {verifyAdmin} = require("../utils/verifytoken");

//for now only the admin can crud posts
//CREATE POST
router.post("/",verifyAdmin, async (req, res) => {
    const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

 


//UPDATE POST
router.put("/:id",verifyAdmin, async (req, res) => {
    try {
    
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }

    } catch (err) {
      res.status(500).json(err);
    }
  });

//DELETE POST
router.delete("/:id",verifyAdmin, async (req, res) => {
    try {
     
        try {
          await Post.deleteOne({ _id: req.params.id });
          res.status(200).json("Le post a été supprimé..");
        } catch (err) {
          res.status(500).json(err);
        }
  
      
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Delete multiple posts or delete all posts
router.delete("/", verifyAdmin, async (req, res) => {
  const { postsIds } = req.body;
  try {
    // Delete multiple League
    await Post.deleteMany({ _id: { $in: postsIds } });
    res.status(200).json("Le post a été supprimé.");
  } catch (err) {
    res.status(500).json(err);
  }
});

  //GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user').populate('categories').populate('club').populate('tags').populate('country').populate('league').populate('likes').populate('player').populate('natclub');
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

 

// GET total number of categories
router.get("/count", async (req, res) => {
  try {
    const postCount = await Post.count();
    res.status(200).json({ count: postCount });
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET ALL POSTS
//also get posts for only one user or cat /?user=adel or /?cat=league1 ....ex
router.get("/", async (req, res) => {
  const userId = req.query.user; // Get user ID from query parameters
  const categoryId = req.query.cat;
  const clubId = req.query.club;
  const natclubId = req.query.natclub;
  const countryId = req.query.country;
  const playerId = req.query.player;
  const leagueId = req.query.league;
  const tagId = req.query.tag;

  try {
    let posts;

    if (userId) {
      // Find posts by user ID
      posts = await Post.find({ user: userId }).select('-content').populate('user');
    } else if (categoryId) {
      // Find posts by category ID
      posts = await Post.find({ categories: categoryId }).populate('categories').select('-content').populate('user');
    } else if (clubId) {
      // Find posts by club ID
      posts = await Post.find({ club: clubId }).select('-content').populate('user').populate('club');
    } else if (natclubId) {
      // Find posts by national club ID
      posts = await Post.find({ nationalClub: natclubId }).select('-content').populate('user').populate('natclub');
    } else if (countryId) {
      // Find posts by country ID
      posts = await Post.find({ country: countryId }).select('-content').populate('user').populate('country');
    } else if (playerId) {
      // Find posts by player ID
      posts = await Post.find({ player: playerId }).select('-content').populate('user').populate('player');
    } else if (leagueId) {
      // Find posts by league ID
      posts = await Post.find({ league: leagueId }).select('-content').populate('user').populate('league');
    } else if (tagId) {
      // Find posts by tag ID
      posts = await Post.find({ tags: tagId }).select('-content').populate('user').populate('club');
    } else {
      // Find all posts
      posts = await Post.find().select('-content').populate('user').populate('categories').populate('club').populate('country').populate('league').populate('tags').populate('likes');

    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
