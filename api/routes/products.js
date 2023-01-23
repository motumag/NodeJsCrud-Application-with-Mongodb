const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
  // res.status(200).json({
  //     message:'Get Handler request'
  // });
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      // console.log(doc)

      //we can use if else also to figure out it
      const response = {
        count: docs.length, //count amount of registered in number
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http:localhost:5000/products/" + doc._id,
            },
          };
        }), //return all the registered peoples/products
      };
      // if(doc.length>=0){
      res.status(200).json(response);
      // }
      // else{
      //     res.status(400).json({message:'No entries found'})
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorResponse: err,
      });
    });
});

router.post("/", (req, res, next) => {
  // const product={
  //     name:req.body.name,
  //     price:req.body.price
  // };
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product is created successfully",
        // createdProduct:result
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http:localhost:5000/products/" + result._id,
          },
        },
      });
    })
    // .catch(err=>console.log(err))
    // res.status(500).json('noes');
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:5000/products",
          },
        });
      } else {
        res.status(400).json({ message: "the doc is not found for this id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorResponse: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  // res.status(200).json({
  //     message:'The record is updated'
  //     });
  const id = req.params.productId;
  // Product.update({_id:id},{$set:{name:req.body.newName,price:req.body.newPrice}}); or
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      // res.status(200).json(result);
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:5000/products/" + id,
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ errorResponse: err });
    });
});
router.delete("/:productId", (req, res, next) => {
  // res.status(200).json({
  //     message:'The record is deleted by ID'
  //     });
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      // res.status(200).json(result)
      res.status(200).json({
        message: "Record has deleted successfully",
        request: {
          type: "DELETE",
          url: "http://localhost:5000/products/" + id,
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        errorResponse: err,
      });
    });
});
module.exports = router;
