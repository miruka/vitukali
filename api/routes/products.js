const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product");

//Get All Products
router.get("/", async (req, res, next) => {
  await Product.find()
    .select("name price _id") //Selelect which product properties shall appear
    .exec()
    .then((foundAllProducts) => {
      //console.log(foundAllProducts);
      const response = {
        NumberofProducts: foundAllProducts.length,
        ListofProducts: foundAllProducts.map((product) => {
          return {
            ProductName: product.name,
            Price: product.price,
            request: {
              type: "GET",
              url: `http://localhost:7000/products/${product._id}`,
            },
          };
        }),
      };
      if (foundAllProducts.length >= 0) {
        res.status(200).json({
          FoundAllProducts: response,
        });
      } else {
        res.status(404).json({
          message: "No Products Found",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

//Post New  Product
router.post("/", async (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  await product
    .save()
    .then((createdProduct) => {
      console.log(createdProduct);
      res.status(201).json({
        Message: "Created Product Successfully",
        CreatedProduct: {
          name: createdProduct.name,
          price: createdProduct.price,
          id: createdProduct.id,
          request: {
            type: "POST",
            url: `http://localhost:7000/products/${createdProduct._id}`,
          },
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

//Get a Single Product
router.get("/:productId", async (req, res, next) => {
  //const id = req.params.productId;
  await Product.findById(req.params.productId)
    .select("name price _id") //Selelect which product properties shall appear
    .exec()
    .then((foundProductId) => {
      console.log(`The found product is: ${foundProductId}`);
      if (foundProductId) {
        res.status(200).json({
          ProductDetails: foundProductId,
          Request: {
            type: "POST",
            url: `http://localhost:7000/products/${foundProductId._id}`,
          },
        });
      } else {
        res.status(404).json({
          Message: "No Valid Entry Found for the Provided Product Id",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        Error: err,
      });
    });
});

//Patch a Product
router.patch("/:productId", (req, res, next) => {
  const updatedProduct = {};
  for (const product of req.body) {
    updatedProduct[product.productName] = product.value;
  }
  Product.update({ _id: req.params.productId }, { $set: updatedProduct })
    .exec()
    .then((productUpdated) => {
      console.log(productUpdated);
      res.status(200).json({
        Message: "Product Has Been  Updated",
        ProductUpdated: productUpdated,
        request: {
          type: "GET",
          url: `http://localhost:7000/products/${productUpdated._id}`,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

// Delete a Product
router.delete("/:productId", async (req, res, next) => {
  //const id = req.params.id;
  await Product.deleteOne({
    _id: req.params.productId,
  })
    .exec()
    .then((deletedProduct) => {
      console.log(deletedProduct);
      res.status(200).json({
        Message: "Product Deleted",
        ProductDeleted: deletedProduct,
        Request: {
          type: "POST",
          url: `http://localhost:7000/products`,
          body: {
            Name: "String",
            Price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;