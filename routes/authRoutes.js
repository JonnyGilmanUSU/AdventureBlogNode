const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Routes
router.post("/signup", authController.postSignUp);

router.post("/login", authController.authUser, authController.loginWebApp);

router.post("/logout", authController.postLogout)




module.exports = router;