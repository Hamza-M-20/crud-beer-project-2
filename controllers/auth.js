
const express = require("express"); 
const router = express.Router(); 
const bcrypt = require('bcrypt'); 
const User = require("../models/user.js"); 
router.get("/", async (req, res) => {
  res.render("index.ejs");
});
console.log("AUTH ROUTER LOADED");
router.get("/sign-up",  (req, res) => { 
res.render("auth/sign-up.ejs"); 
}); 
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
}); 
   router.post("/sign-up", async (req, res) => { 
    
    const userInDatabase = await User.findOne({ username: req.body.username }); 
    
    if (userInDatabase) { 
    
    return res.send("Username already taken."); 
    
    } 
    
    if (req.body.password !== req.body.confirmPassword) { 
    
    return res.send("Password and Confirm Password must match"); 
    
    } 
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); 
    
    req.body.password = hashedPassword; 
    
   
    const user = await User.create(req.body); 
    
    res.send(`Thanks for signing up ${user.username}`); 
  
    }); 
    
    router.post("/sign-in",async (req, res) => { 
    try {
    const userInDatabase = await User.findOne( {username: req.body.username} ) 
   console.log("user from DB:", userInDatabase);
    
    if (!userInDatabase) { 
    
    return res.send("login failed, please try again"); 
    
    } 
    console.log("password from DB:", userInDatabase.password);
    console.log("password from Form:", req.body.password);
    const validPassword = bcrypt.compareSync( 
    req.body.password, 
    userInDatabase.password 
    
    );
    
    if (!validPassword) { 
    
    return res.send("Login failed. Please try again."); 
   
   } 
    
    req.session.user = { 
    
    username: userInDatabase.username, 
    
    _id: userInDatabase._id 
    
    }; 
    
  res.redirect("/"); 
    
   } catch (error) {
    console.log(error);
    res.redirect("/");
   }
});
router.get("/sign-out", async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.log("Error signing out:", error);
        return res.redirect("/users");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.log("something went wrong during sign out");
    res.redirect("/users");
    
  }
});

module.exports = router;