const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  //Before validation-eg=> if we use price value string it will respond error
  //if we try to create the name only, without price it will work=> that is not how it work
  //------------------------------------------------------------------------------------
  // _id:mongoose.Schema.Types.ObjectId,
  // name: String,
  // price: Number
  //------------------------------------------------------------------------------------------------
  //AFTER THE VALIDATION
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
});
module.exports = mongoose.model("Product", productSchema); //export to use in the businessApp module.
