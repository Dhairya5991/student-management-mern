
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  attendance: Number,
  marks: Number
});

module.exports = mongoose.model("Student", studentSchema);
