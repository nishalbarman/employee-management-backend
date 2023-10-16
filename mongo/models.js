const mongoose = require("mongoose");

// schema starts

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const employeeSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

// model starts

const User = mongoose.model("users", userSchema);
const Employee = mongoose.model("employees", employeeSchema);

module.exports = { User, Employee };
