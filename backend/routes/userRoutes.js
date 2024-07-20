const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', userController.postUserSignup);
router.post('/login',  userController.postUserLogin);



module.exports = router;