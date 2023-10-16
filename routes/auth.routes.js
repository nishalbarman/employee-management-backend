const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { User } = require("../mongo/models");

const router = Router();

const secret = process.env.SECRET || "XYZ";

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashed_password;
    const user = new User(req.body);
    await user.save();
    return res.send({ status: true, message: "User created!" });
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.MongooseError) {
      return res.send({
        status: false,
        message: "Required fields are missing!",
      });
    }
    return res.send({ status: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(req.body);
    if (user) {
      const hashed = user.password;
      const result = bcrypt.compareSync(req.body.password, hashed);
      if (result) {
        const token = jwt.sign({ _id: user.id }, secret);
        return res.send({
          status: true,
          token: token,
          message: "Login Successful",
        });
      }
    }
    return res.send({ status: false, message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.MongooseError) {
      return res.send({ status: false, message: "Invalid Credentials" });
    }
    return res.send({ status: false, message: "Invalid Credentials" });
  }
});

module.exports = router;
