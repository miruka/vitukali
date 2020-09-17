const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const User = require("../models/User");
const UsersController = require("../controllers/users");
//Create New User
router.post("/signup", UsersController.createNewuser);

//User Login
router.post("/login", UsersController.userLogin);

//Delete User && Delete Duplicate User
router.delete("/:userId", checkAuth, UsersController.deleteUser);

module.exports = router;
