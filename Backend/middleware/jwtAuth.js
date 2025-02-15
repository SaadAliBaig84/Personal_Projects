const { User } = require("../models/psqlWrapper");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("here , no auth");
    return res.status(401).send({ Error: "Authorization token required." });
  }

  const token = authorization.split(" ")[1];
  console.log(token);
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(`Token: ${token}, ID: ${id}`);
    const match = await User.findById(id);

    if (!match) {
      console.log("No match, id: " + id);
      return res.status(401).send("Invalid token.");
    }

    req.user = match.id;

    console.log(match.name, "has been authorized.");
    console.log("here 2");
    next();
  } catch (error) {
    console.log("here 3");
    res.status(401).send({ Error: error.message });
  }
};

module.exports = requireAuth;
