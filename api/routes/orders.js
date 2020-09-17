const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

const OrdersController = require("../controllers/orders");

// Get All Orders
router.get("/", checkAuth, OrdersController.getAllOrders);

// Create a New Order
router.post("/", checkAuth, OrdersController.createNewOrder);

//Get Single Order
router.get("/:orderId", checkAuth, OrdersController.getSingleOrder);

router.delete("/:orderId", checkAuth, OrdersController.deleteSingleOrder);

module.exports = router;
