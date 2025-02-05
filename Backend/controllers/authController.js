const { validateUserParams } = require("../Utils/authUtils");
const {
  createUser,
  updateGoogleToken,
  createGoogleUser,
} = require("../models/authQuery");
const jwt = require("jsonwebtoken");
const { getAllUsers, getUserByEmail } = require("../models/userQuery");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Strategy } = require("passport-local");
async function encyptPass(pass) {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
const signUp = async function (req, res) {
  try {
    const params = validateUserParams(req.body, "s");
    const hashedPass = await encyptPass(params.pass);
    const user = await createUser(params.name, params.email, hashedPass);
    const currJwt = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 86400,
    });
    res.status(200).send({
      name: user.name,
      jwt: currJwt,
      googleVerified: false,
    });
  } catch (error) {
    res.status(400).send({ Error: error });
  }
};

const signOut = async function (req, res) {
  try {
    res.status(200).send({ Message: "Signed Out successfully" });
  } catch (error) {
    res.status(400).send({ Error: error });
  }
};

// passport.use(
//   new Strategy(
//     {
//       usernameField: "email",
//       passwordField: "pass",
//     },
//     async (email, pass, done) => {}
//   )
// );

const logIn = async function (req, res) {
  try {
    const params = validateUserParams(req.body, "l");
    console.log("params done");

    // Fetch the user by email
    const user = await getUserByEmail(params.email);
    if (!user) {
      return res.status(404).send({ Error: "User not found" });
    }

    const match = await bcrypt.compare(params.pass, user.password);
    if (!match) {
      throw Error("Invalid credentials");
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const newJwt = jwt.sign({ id: user.id }, jwtSecretKey, {
      expiresIn: 86400,
    });
    res.status(200).send({
      name: user.name,
      jwt: newJwt,
      googleVerified: false,
    });
  } catch (error) {
    console.error("Error in logIn:", error);
    res.status(400).send({ Error: error.message });
  }
};

const googleSignIn = async (req, res) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const newJwt = jwt.sign({ id: req.user.id }, jwtSecretKey, {
      expiresIn: 86400,
    });
    console.log(req.user._doc._id.value);
    const params = new URLSearchParams({
      name: req.user.name,
      jwt: newJwt,
      googleVerified: true,
    });
    console.log("sending params");
    res.redirect(`http://localhost:5173?${params}`);
  } catch (error) {
    console.log(error);
  }
};
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (user, done) => {
  done(null, user);
});
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },

    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await getUserByEmail(profile.emails[0].value);
        if (user) {
          await updateGoogleToken(profile, accessToken, refreshToken);
        } else {
          user = await createGoogleUser(profile, accessToken, refreshToken);
        }

        done(null, { ...user, accessToken, refreshToken });
      } catch (error) {
        console.log(error);
      }
    }
  )
);

module.exports = {
  signUp,
  logIn,
  signOut,
  googleSignIn,
};
