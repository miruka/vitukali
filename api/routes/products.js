const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");

const ProductsController = require("../controllers/products");

//Detailed way of Storing Files
const fileFilter = (req, file, cb) => {
  //Reject File
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

//Uploaded File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
  fileFilter: fileFilter,
});

//Intitialise Multer to PArse multi-form FormData
//Multer will install all incoming files from Form Data to folder named upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

//Get All Products
router.get("/", ProductsController.getAllProducts);

//Create New  Product
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.createNewProduct
);

//Get Single Product
router.get("/:productId", ProductsController.getSingleProduct);

//Patch a Product
router.patch("/:productId", checkAuth, ProductsController.patchSingleProduct);

// Delete a Product
router.delete("/:productId", checkAuth, ProductsController.deleteProduct);

module.exports = router;
