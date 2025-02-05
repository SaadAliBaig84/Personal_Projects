const express = require("express");
const router = express.Router();

const {
  signUp,
  logIn,
  signOut,
  googleSignIn,
} = require("../controllers/authController");
const passport = require("passport");
router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.post("/signOut", signOut);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    accessType: "offline",
  })
);
router.get("/googelFailure", (req, res) => {
  res.status(400).send("Something went wrong");
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5137",
  }),
  googleSignIn
);
module.exports = router;
