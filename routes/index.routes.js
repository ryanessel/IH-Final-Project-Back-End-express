const mongoose = require('mongoose');
const router = require("express").Router();
const User = require("../models/User.model");
const Part = require("../models/Part.model")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
