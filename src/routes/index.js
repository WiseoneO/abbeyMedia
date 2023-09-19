const express = require("express");
const router = express.Router();
const config = require("./../config/default");
const ErrorHandler = require('../utils/errorHandler')

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    version: config.version,
    env: config.node_env,
  });
});

router.use('/v1', require('./v1'));

// router.all("*", (req, res, next) => {
//   return next(new ErrorHandler(`${req.originalUrl} endpoint doesn't exist`, 404));
// });

module.exports = router;
