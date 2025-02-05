const express = require("express");
const router = express.Router();

const { getPaginatedBooks } = require("../controllers/books");
const requireAuth = require("../middleware/jwtAuth");
//router.get("/", requireAuth, getPaginatedBooks);
router.get("/", requireAuth, getPaginatedBooks);
module.exports = router;
