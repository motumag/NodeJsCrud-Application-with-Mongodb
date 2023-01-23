const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");

router.get("/", (req, res, next) => {
  // res.status(200).json({
  //     message:'The orders are fatched'
  //     });
  Order.find()
    .select("_id product quantity")
    .exec()
    .then((docs) => {
      // res.status(200).json(docs);
      count: docs.length,
        res.status(200).json({
          count: docs.length,
          // order:docs=>you can leave bellow code use this one....or optional and preferable way is ...
          order: docs.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                description: "all orders by Motuma Gishu",
                type: "GET",
                url: "http://localhost:5000/orders/" + doc._id,
              },
            };
          }),
        });
    })
    .catch((err) => {
      res.status(500).json({ errorResponse: err });
    });
});
router.post("/", (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(), //generate a default id which is string
    quantity: req.body.quantity,
    product: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      // console.log(result);
      // res.status(201).json({result});
      res.status(201).json({
        message: "Order is stored successfully",
        request: {
          type: "GET",
          url: "http://localhost:5000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ ErrorOrderResponse: err });
    });

  // res.status(201).json({
  //     message:'The orders are created'
  //     });
});

router.get("/:orderId", (req, res, next) => {
  // // const id=req.params.orderId;
  // res.status(200).json({
  //     message:'The orders details using ID',
  //     // id:id or
  //     orderId:req.params.orderId
  //     });
  const id = req.params.orderId;
  Order.findById(id)
    .select("_id product quantity")
    .exec()
    .then((docs) => {
      const pid = docs.product;
      // res.status(200).json(docs);
      res.status(200).json({
        orderResponse: docs,
        cheekProduct: {
          type: "GET",
          url: "http://localhost:5000/products/" + pid, //if you want to cheek the orderd product
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ errorGetbyidResponse: err });
    });
});

router.delete("/:orderId", (req, res, next) => {
  // const id=req.params.orderId;
  res.status(200).json({
    message: "The orders deleted using ID",
    // id:id or
    orderId: req.params.orderId,
  });
});
module.exports = router;
