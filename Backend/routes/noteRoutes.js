const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/jwtAuth");
const {
  createNote,
  getUserNotes,
  getUserBookNotes,
} = require("../controllers/notesController");

router.post("/create-note", requireAuth, createNote);
router.get("/getUserNotes", requireAuth, getUserNotes);
router.post("/getUserBookNotes", requireAuth, getUserBookNotes);
module.exports = router;
