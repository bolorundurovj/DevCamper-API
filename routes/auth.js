const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.post('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/forgotpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
