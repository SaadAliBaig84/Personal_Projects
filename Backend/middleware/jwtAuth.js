const { User } = require("../models/psqlWrapper");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("here , no auth");
    return res.status(401).send({ Error: "Authorization token required." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(`Token: ${token}, ID: ${id}`);
    const match = await User.findById(id);

    if (!match) {
      return res.status(401).send("Invalid token.");
    }

    req.user = match.id;

    console.log(match.name, "has been authorized.");
    next();
  } catch (error) {
    res.status(401).send({ Error: error.message });
  }
};

module.exports = requireAuth;
