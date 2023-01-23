const mongoose = require("mongoose");

const orderchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});
module.exports = mongoose.model("Order", orderchema); //export to use in the businessApp module.
