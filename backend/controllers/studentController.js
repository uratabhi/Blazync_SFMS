const asyncHandler = require("express-async-handler");
const studentData = require("../data/data");

const getAllStudentsDetails = asyncHandler(async (req, res, next) => {
  res.send(studentData);
});

const updateStudentDetails = asyncHandler(async (req, res, next) => {
  const rollNumber = req.params.rollNumber;
  const updatedData = req.body;
  console.log(rollNumber, updatedData);
  const updatedStudent = studentData.updateStudentByRollNumber(rollNumber, updatedData);
  if (updatedStudent) {
    res.json(updatedStudent);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

module.exports = { getAllStudentsDetails, updateStudentDetails };
