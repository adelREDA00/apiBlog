const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const {verifyUser,verifyAdmin} = require("../utils/verifytoken");

router.put("/:id", verifyUser, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      clubIds,
      leagueIds,
      postBookMarkIds,
      countryIds,
      playerIds,
      natclubIds,
      isAdmin,
    } = req.body;

  

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

      // If the user changes the password, encrypt and update it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        user.password = encryptedPassword;
      }

    // Update username and email if provided
    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }
     // Update isAdmin field if provided
     if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }

    // Helper function to remove existing IDs from the user's array
    const removeExistingIds = (existingIdsArray, idsToRemove) => {
      const filteredIds = existingIdsArray.filter(
        (existingId) => !idsToRemove.includes(existingId.toString())
      );
      return filteredIds;
    };

    
     
       
    

    // Helper function to add new IDs to the user's array
    const addNewIds = (existingIdsArray, newIds) => {
      const filteredNewIds = newIds.filter(
        (newId) => !existingIdsArray.includes(newId.toString())
      );
      return [...existingIdsArray, ...filteredNewIds];
    };



   

    // Add new saved post IDs
    if (postBookMarkIds) {
         // Check if the bookmarkedPostId exists in the user's postBookMark array
       
         const bookmarkIndex = user.postBookMark.indexOf(postBookMarkIds);
   
         if (bookmarkIndex !== -1) {
           // If the bookmarkedPostId exists, remove it from the array
           user.postBookMark.splice(bookmarkIndex, 1);
         } else {
           // If the bookmarkedPostId doesn't exist, add it to the array
           user.postBookMark.push(postBookMarkIds);
         }
     
    
    }


        // Add new fav league
        if (leagueIds) {
          // Check if the bookmarkedPostId exists in the user's postBookMark array
        
          const leagueIndex = user.leagues.indexOf(leagueIds);
    
          if (leagueIndex !== -1) {
            // If the bookmarkedPostId exists, remove it from the array
            user.leagues.splice(leagueIndex, 1);
          } else {
            // If the bookmarkedPostId doesn't exist, add it to the array
            user.leagues.push(leagueIds);
          }
      
     
     }

         // Add new fav country
         if (countryIds) {
          // Check if the bookmarkedPostId exists in the user's postBookMark array
        
          const countryIndex = user.countries.indexOf(countryIds);
    
          if (countryIndex !== -1) {
            // If the bookmarkedPostId exists, remove it from the array
            user.countries.splice(countryIndex, 1);
          } else {
            // If the bookmarkedPostId doesn't exist, add it to the array
            user.countries.push(countryIds);
          }
      
     
     }

     
            // Add new fav club
            if (clubIds) {
              // Check if the bookmarkedPostId exists in the user's postBookMark array
            
              const clubIndex = user.clubs.indexOf(clubIds);
        
              if (clubIndex !== -1) {
                // If the bookmarkedPostId exists, remove it from the array
                user.clubs.splice(clubIndex, 1);
              } else {
                // If the bookmarkedPostId doesn't exist, add it to the array
                user.clubs.push(clubIds);
              }
          
         
         }




    // Remove existing player IDs
    if (playerIds && Array.isArray(playerIds)) {
      user.player = removeExistingIds(user.player, playerIds);
    }

    // Add new player IDs
    if (playerIds && Array.isArray(playerIds)) {
      user.player = addNewIds(user.player, playerIds);
    }

    // Remove existing natclub IDs
    if (natclubIds && Array.isArray(natclubIds)) {
      user.natclubs = removeExistingIds(user.natclubs, natclubIds);
    }

    // Add new natclub IDs
    if (natclubIds && Array.isArray(natclubIds)) {
      user.natclubs = addNewIds(user.natclubs, natclubIds);
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE  
/*router.put("/:id", verifyUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, clubIds, leagueIds,postBookMarkIds, countryIds, playerIds, natclubIds } = req.body;

    // If the user changes the password, encrypt it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username and email if provided
    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    // Add new club IDs
    if (clubIds && Array.isArray(clubIds)) {
      const existingClubIds = user.clubs.map((club) => club.toString());
      const newClubIds = clubIds.filter((clubId) => !existingClubIds.includes(clubId));
      user.clubs.push(...newClubIds);
    }

    
    // Add new saved post IDs
    if (postBookMarkIds && Array.isArray(postBookMarkIds)) {
      const existingPostIds = user.postBookMark.map((post) => post.toString());
      const newPostIds = postBookMarkIds.filter((postId) => !existingPostIds.includes(postId));
      user.clubs.push(...newPostIds);
    }

    // Add new league IDs
    if (leagueIds && Array.isArray(leagueIds)) {
      const existingLeagueIds = user.leagues.map((league) => league.toString());
      const newLeagueIds = leagueIds.filter((leagueId) => !existingLeagueIds.includes(leagueId));
      user.leagues.push(...newLeagueIds);
    }

    // Add new country IDs
    if (countryIds && Array.isArray(countryIds)) {
      const existingCountryIds = user.countries.map((country) => country.toString());
      const newCountryIds = countryIds.filter((countryId) => !existingCountryIds.includes(countryId));
      user.countries.push(...newCountryIds);
    }

    // Add new player IDs
    if (playerIds && Array.isArray(playerIds)) {
      const existingPlayerIds = user.players.map((player) => player.toString());
      const newPlayerIds = playerIds.filter((playerId) => !existingPlayerIds.includes(playerId));
      user.player.push(...newPlayerIds);
    }

    // Add new natclub IDs
    if (natclubIds && Array.isArray(natclubIds)) {
      const existingNatClubIds = user.natclubs.map((natclub) => natclub.toString());
      const newNatClubIds = natclubIds.filter((natclubId) => !existingNatClubIds.includes(natclubId));
      user.natclubs.push(...newNatClubIds);
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});*/





//DELETE
router.delete("/:id",verifyUser, async (req, res) => {
    try {
      //find the user by id
      const user = await User.findById(req.params.id);
      try {
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



 // GET total number of categories
 router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    console.log(count);
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET USER
router.get("/:id",verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('clubs').populate('countries').populate('leagues');
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Utilisateur n'existe pas");
  }
});

//get saved posts
router.get("/:userId/posts", verifyUser,async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user document based on the user ID
    const user = await User.findById(userId);

    // Get the array of post IDs from the user document
    const bookmarkedPostIds = user.postBookMark;

    // Fetch the posts based on the bookmarkedPostIds
    const bookmarkedPosts = await Post.find(
      {
        _id: { $in: bookmarkedPostIds },
      },
      {
        content: 0, // Exclude the content field
      }
    ).populate('categories');

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarked posts" });
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