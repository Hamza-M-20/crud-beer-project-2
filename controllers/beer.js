const express = require("express"); 
const router = express.Router(); 
const User = require("../models/user.js")
const Beer = require("../models/beer.js");
const Order = require("../models/order.js");
router.get("/", async (req, res) => {
    const beers = await Beer.find({});
    res.render("views/index.ejs", { beers });
});
router.get("/new", (req, res) => {
    res.render("beers/new.ejs");
});

console.log("GET/:userId/beers route");
router.get("/:userId/beers", async (req, res) => {
    try {
        const beers = await Beer.find({ user: req.params.userId });
        const user = await User.findById(req.params.userId);
        res.render("beers/index.ejs", {
            beers,
            user
        });
    } catch (error) {
        console.log("FAILED TO FETCH BEERS:", error);
        res.redirect("/");
    }
});
router.get("/beers/new/:userId", async (req, res) => {
    res.render("beers/new.ejs", {userId: req.params.userId});
});
router.post("/:userId/beers", async (req, res) => {
    try {
        const beerData = req.body;
        beerData.user = req.params.userId;
        beerData.price = Number(beerData.price);
        beerData.abv = Number(beerData.abv);
        await Beer.create(beerData);
        res.redirect(`/users/${req.params.userId}/beers`);
    } catch (error) {
        console.log("BEER CREATION ERROR:", error);
        res.redirect("/");
        
    }
});
router.get("/:userId/beer", (req, res) => {
    res.redirect(`/users/${req.params.userId}/beers`)
});
router.get("/beers", async (req, res) => {
    const beers = await Beer.find({});
    res.render("beers/catalogue.ejs", { beers });
});
router.get("/beers/new", async(req, res) => {
    res.render("beers/new.ejs");
})
router.post("/users/:userId/beers", async (req, res) => {
    try {
      await Beer.create(req.body);
      res.redirect(`/users/${req.params.userId}/beers`);  
    } catch (error) {
        console.log("ERROR LOADING BEER:", error);
        res.send("failed to add beer");
    }
});
router.put("/orders/:id/", async (req, res) => {
try {
    const order = await Order.findById(req.params.id);
    const newQuantity = parseInt(req.body.quantity);
    order.quantity = newQuantity;
    const beer = await Beer.findById(order.beers[0]);
    order.quantity = Number(req.body.quantity);
    order.totalAmount = beer.price * newQuantity;
    await order.save();
    res.redirect("/orders");
} catch (error) {
    console.log(error);
    res.redirect("/orders");
}
});
router.delete("/orders/:id", async (req, res) => {
try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect("/orders");
} catch (error) {
    console.log(error);
    res.redirect("/");
}
});

router.post("/beers", async (req, res) => {
    try {
       await Beer.create(req.body);
       res.redirect("/beers"); 
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;