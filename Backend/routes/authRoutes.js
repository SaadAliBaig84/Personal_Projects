const express = require('express');
const router = express.Router();

const {signUp, logIn} = require('../controllers/authController');
console.log(signUp);
router.post("/signUp", signUp);
router.post("/logIn", logIn);
module.exports =  router;