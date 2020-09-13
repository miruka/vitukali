const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

// Get All Orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((allOrders) => {
      console.log(allOrders);
      if (allOrders.length >= 0) {
        res.status(200).json({
          Message: "All Orders were Fetched",
          NumberOfOrders: allOrders.length,
          AllOrders: allOrders.map((myOrders) => {
            return {
              _id: myOrders._id,
              product: myOrders.product,
              quantity: myOrders.quantity,
              Request: {
                type: "GET",
                url: `http://localhost:7000/orders/${myOrders._id}`,
              },
            };
          }),
        });
      } else {
        res.status(404).json({
          message: "No Orders Found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: err,
      });
    });
});

// Create a New Order
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          Message: "Product Not Found",
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((orderCreated) => {
      console.log(orderCreated);
      res.status(201).json({
        Message: "Orders were CREATED",
        OrderCreated: {
          _id: orderCreated._id,
          product: orderCreated.product,
          quantity: orderCreated.quantity,
        },
        Request: {
          type: "GET",
          url: `http://localhost:7000/orders/${orderCreated._id}`,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        Message: "Product Not Found",
        Error: err,
      });
    });
});

//Get Single Order
router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .select("_id product quantity")
    .exec()
    .then((foundOrderId) => {
      if (!foundOrderId) {
        return res.status(404).json({
          Message: "Order Not Found",
        });
      }
      console.log(foundOrderId);
      res.status(200).json({
        Message: "Order Found",
        OrderDetails: foundOrderId,
        Request: {
          type: "GET",
          url: `http://localhost:7000/orders`,
        },
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ Error: error });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({
    _id: req.params.orderId,
  })
    .exec()
    .then((deletedOrder) => {
      console.log(deletedOrder);
      res.status(200).json({
        Message: "Order Deleted",
        Request: {
          type: "POST",
          url: `http://localhost:7000/orders`,
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ Error: error });
    });
});

module.exports = router;
