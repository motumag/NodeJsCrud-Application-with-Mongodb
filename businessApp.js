const express = require("express");
const bussinessApp = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
// var cors = require("cors");

//add morgan to catch the logs
bussinessApp.use(morgan("dev")); // Morgan is a logger middleware
bussinessApp.use(bodyParser.urlencoded({ extended: false }));
bussinessApp.use(bodyParser.json());
//to handle here the cors
// bussinessApp.use(cors())

//mongodb://localhost:27017=>mongodb link

bussinessApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.header('Access-Control-Allow-Credentials', true);
  // "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"
  // next();
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    return res.status(200).json({ message: "method is allowed" });
  }
  next(); //if you delete this thing, you will not get any response,=>timeout
});

//add the routers here......
bussinessApp.use("/products", productRoute);
bussinessApp.use("/orders", ordersRoute);
//connect mongodb
const mongoDB = "mongodb://127.0.0.1/HouseRent";
mongoose.connect(mongoDB, { useNewUrlParser: true }); //useNewUrlParser: true, useUnifiedTopology: true
mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//handle the error here if the request doesn't come neither in /products nor /orders
bussinessApp.use((req, res, next) => {
  const error = new Error("Not found");
  // error.status(404);
  error.status = 404;
  next(error);
});
bussinessApp.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    errorResponse: {
      message: error.message,
    },
  });
});
module.exports = bussinessApp;
