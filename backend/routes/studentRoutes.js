const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

router.get('/', studentController.getAllStudentsDetails);
router.put('/:rollNumber', studentController.updateStudentDetails);




module.exports = router;