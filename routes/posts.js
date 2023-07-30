const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");


const {verifyAdmin,verifyUser,verifyToken} = require("../utils/verifytoken");

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




  // likes
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming you have the user ID available

    // Check if the user has already liked the post
    const post = await Post.findById(id);
    const likedByUser = post.likes.includes(userId);

    if (likedByUser) {
      // User has already liked the post, remove their ID
      await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: userId },
        }
      );
      post.likes.pull(userId); // Update the local post object

      res.status(200).json({ liked: false, count: post.likes.length });
    } else {
      // User has not liked the post, add their ID
      await Post.findByIdAndUpdate(
        id,
        {
          $push: { likes: userId },
        }
      );
      post.likes.push(userId); // Update the local post object

      res.status(200).json({ liked: true, count: post.likes.length });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

  
  

// DELETE POST
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    // Fetch the post data to get the filename of the cover image
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    
    // Check if the post has a cover image
    if (post.photo) {
      // Construct the path to the cover image
      const imagePath = path.join(__dirname, "../images", post.photo);

      // Delete the image file from the server
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }


    // Delete the post from the database
    await Post.deleteOne({ _id: req.params.id });

    res.status(200).json("Le post a été supprimé.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete multiple posts or delete all posts
router.delete("/", verifyAdmin, async (req, res) => {
  const { postsIds } = req.body;
  try {
    // Fetch the post data for all the posts to be deleted
    const posts = await Post.find({ _id: { $in: postsIds } });

    // Delete the posts from the database
    await Post.deleteMany({ _id: { $in: postsIds } });

    // Loop through the posts and delete their cover images (if any)
    posts.forEach((post) => {
      if (post.photo) {
        const imagePath = path.join(__dirname, "../images", post.photo);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }
    });

    res.status(200).json("Les posts ont été supprimés.");
  } catch (err) {
    res.status(500).json(err);
  }
});
  


  //GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user').populate('categories').populate('club').populate('tags').populate('country').populate('league').populate('player').populate('natclub').populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username profilePic", // Include the fields you want to populate for the user within comments
      },
    });
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
      posts = await Post.find({ club: clubId }).select('-content').populate('categories').populate('user').populate('club');
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
      posts = await Post.find({ league: leagueId }).select('-content').populate('categories').populate('user').populate('league');
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
