const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/ pass-user-to-view.js");
const authRoutes = require("./controllers/auth");
const beerControllers = require("./controllers/beer.js");
const orderController = require("./controllers/order.js");
const order = require("./models/order.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
   
);
app.use(passUserToView);
app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/beer`);
    } else {
    res.render("index.ejs");
    }
   
});
app.use("/auth", authRoutes);
app.use(isSignedIn);

//app.use("/users/:userId/beer", beerControllers);
//app.use("/users/:userId/beers", (req, res, next) =>{
  //req.userId = req.params.userId;
  //next();
//}, require("./controllers/beer"));
app.use("/users", beerControllers);
app.use("/", beerControllers);
app.use("/", orderController);
app.use(orderController);
app.use("/auth", require("./controllers/auth.js"));
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });