const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//Create New User
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((existingUser) => {
      if (existingUser.length >= 1) {
        return res.status(409).json({
          Message: "E-mail Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              Message: "We could Not Safely Hash the Password",
              Error: "Invalid Password or No password Entered",
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((createdUser) => {
                console.log(createdUser);
                res.status(201).json({
                  Message: "User Created Successfully",
                  CreatedUser: createdUser,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  Message: "Something went wrong when Creating User",
                  Error: err,
                });
              });
            console.log(user);
          }
        });
      }
    });
});

//User Login
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        console.log(user);
        return res.status(401).json({
          message: "Authentification Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        // result == true
        if (err) {
          //console.log(err);
          return res.status(401).json({
            message: "Authentification Failed",
          });
        }
        if (result) {
          //Creating Token
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            Message: "Authentication Successful",
            Token: token,
          });
        }
        res.status(401).json({
          Message: "Authentication Failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//Delete User && Delete Duplicate User
router.delete("/:userId", (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((deleteUser) => {
      res.status(200).json({
        Message: "Deleted User Successfully",
        DeletedUser: deleteUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "User Not Found",
        error: err,
      });
    });
});

module.exports = router;
