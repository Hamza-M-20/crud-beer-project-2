const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const order = require("../models/order");
const Beer = require("../models/beer");
router.get("/orders", async(req, res) => {
    const userId = req.session.user._id;
    const orders = await order.find({user: userId}).populate("beers");
    res.render("orders/myOrders", { orders });
})

router.post("/orders", async (req, res) => {
    const { beerId, quantity } = req.body;
    const userId = req.session.user._id;
    const qty = Number(quantity);
    if (qty === 0) {
        return res.redirect("/beers");
    }
    const beer = await Beer.findById(beerId);
    await order.create({
        user: userId,
        beers: [beerId],
        orderDate: new Date(),
        totalAmount: beer.price,
        quantity: Number(quantity)
    });
    res.redirect("/orders");
});
router.get("/orders/:id/edit", async (req, res) => {
    try {
       const order = await order.findById(req.params.id).populate("beers");
       res.render("orders/myOrders", { order }); 
    } catch (error) {
        console.log(error);
        res.redirect("/orders");
    }
});
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find({}).populate("beers").sort({ orderDate: 1 });
        res.render("orders/myOrders", { orders});
    
    } catch (error) {
        console.log(error);
        res.redirect("/");
        
    }
    
})
module.exports = router;