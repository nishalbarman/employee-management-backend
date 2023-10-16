const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const secret = process.env.SECRET || "XYZ";

const router = Router();
const { Employee } = require("../mongo/models");

const authenticate = (req, res, next) => {
  try {
    const token = req.get("token");
    const result = jwt.verify(token, secret);
    if (result) {
      req._id = result._id;
      next();
      return;
    }
    return res.send({ status: false, message: "Invalid access!" });
  } catch (err) {
    console.log("Auth error => ", err);
    return res.send({ status: false, message: "Invalid access!" });
  }
};

router.get("/", authenticate, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    let employees = null;
    const object = {};
    let total = 0;
    if (req.query.firstname) {
      object.firstname = req.query.firstname;
    }
    if (req.query.department) {
      object.department = req.query.department;
    }
    if (req.query.sort) {
      total = Employee.find(object).sort({ salary: req.query.sort }).count();
      employees = Employee.find(object)
        .sort({ salary: req.query.sort })
        .skip(skip)
        .limit(limit);
    } else {
      total = Employee.find(object).count();
      employees = Employee.find(object).skip(skip).limit(limit);
    }

    const [totalPages, employeeList] = await Promise.all([total, employees]);

    return res.send({
      status: true,
      result: { total: +totalPages, list: employeeList },
    });
  } catch (err) {
    console.log(err);
    return res.send({ status: false, message: "Internal Server Error" });
  }
});

router.post("/add", authenticate, async (req, res) => {
  try {
    const empl = new Employee(req.body);
    await empl.save();

    return res.send({
      status: true,
      message: "Employee record added!",
    });
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

router.patch("/update/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    delete req.body.id;
    await Employee.updateOne({ _id: id }, req.body);
    return res.send({
      status: true,
      message: "Employee record updated!",
    });
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

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    delete req.body.id;
    await Employee.deleteOne({ _id: id }, req.body);
    return res.send({
      status: true,
      message: "Employee record deleted!",
    });
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

module.exports = router;
