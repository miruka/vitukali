const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

//Connect to Mongoose
mongoose.connect(
  "mongodb+srv://pmauser:" +
    process.env.MONGO_ATLAS_PW +
    "@vitukali.p7b8y.mongodb.net/vitukali?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected To Mongo DB");
  }
);
mongoose.Promise = global.Promise;
//Log requests and responses on consoleS
app.use(morgan("dev"));

//Used to parse url enconded bodies and json
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }));

//Setting headers,method and origins  to Handle/Prevent CORS errors
//Usually added on the server side NOT Client Side
app.use((req, res, next) => {
  //Set allowed Origins
  res.header("Access-Control-Allow-Origin", "*");

  //Set allowed Headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //Set Allowed Methods
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});

//Routes which should Handle Requests
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

// Middleware of Handling Error when URL Endpoint is NOT FOUND
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//Handling of Errors FOUND Anywhere in the Appplication
//Errors from Database
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//Create Server and Listening Port
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Listening on Server PORT ${port}`);
});
