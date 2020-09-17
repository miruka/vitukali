const mongoose = require("mongoose");

const Product = require("../models/Product");

exports.getAllProducts = async (req, res, next) => {
  await Product.find()
    .select("name price _id productImage") //Selelect which product properties shall appear
    .exec()
    .then((foundAllProducts) => {
      //console.log(foundAllProducts);
      const response = {
        NumberofProducts: foundAllProducts.length,
        ListofProducts: foundAllProducts.map((product) => {
          return {
            ProductName: product.name,
            Price: product.price,
            ProductImage: product.productImage,
            ProductId: product._id,
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
};

exports.createNewProduct = (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((createdProduct) => {
      console.log(createdProduct);
      res.status(201).json({
        Message: "Created Product Successfully",
        CreatedProduct: {
          Name: createdProduct.name,
          Price: createdProduct.price,
          ProductImage: createdProduct.productImage,
          ProductId: createdProduct.id,
          Request: {
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
};

exports.getSingleProduct = (req, res, next) => {
  //const id = req.params.productId;
  Product.findById(req.params.productId)
    .select("name price _id productImage") //Selelect which product properties shall appear
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
};

exports.patchSingleProduct = (req, res, next) => {
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
};

exports.deleteProduct = async (req, res, next) => {
  //const id = req.params.id;
  await Product.deleteOne({ _id: req.params.productId })
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
};
