const express = require("express");
const router = express.Router();

const { signUp, logIn, signOut } = require("../controllers/authController");
router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.post("/signOut", signOut);
module.exports = router;
