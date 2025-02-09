const { createGoogleDoc } = require("../Utils/docsUtils");
const { User } = require("../models/psqlWrapper");
const { Notes } = require("../models/psqlWrapper");
const mongoose = require("mongoose");
const createNote = async (req, res) => {
  const docTitle = req.body.title;
  const bookTitle = req.body.bookTitle;
  console.log(req.body);
  console.log("Creating note:", docTitle);
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).send({ Error: "User not found" });
    }

    if (!user.google_data || !user.google_data.access_token) {
      return res.status(400).send({ Error: "Google account not connected" });
    }

    const docId = await createGoogleDoc(
      user.google_data.access_token,
      docTitle
    );
    await Notes.updateOne(
      { user: req.user, book: bookTitle },
      { $push: { notes: { name: docTitle, googleDocId: docId } } },
      { upsert: true }
    );
    res.status(201).send({
      success: true,
      docUrl: `https://docs.google.com/document/d/${docId}/edit`,
    });
  } catch (error) {
    console.error("❌ Error creating document:", error);
    res
      .status(500)
      .send({ success: false, Error: "Failed to create document" });
  }
};

const getUserNotes = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user);

  try {
    const userNotes = await Notes.find({ user: userId });

    if (!userNotes.length) {
      return res.status(404).json({ error: "No notes found" });
    }
    console.log("User notes:", userNotes);
    res.status(200).send({ notes: userNotes });
  } catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ error: "Failed to fetch user notes" });
  }
};

const getUserBookNotes = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user);

  try {
    console.log(userId);
    console.log(req.body);
    const userNotes = await Notes.findOne({
      user: userId,
      book: req.body.bookTitle,
    });

    console.log("User notes:", userNotes);
    res.status(200).send({ notes: userNotes });
  } catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ error: "Failed to fetch user notes" });
  }
};
module.exports = { createNote, getUserNotes, getUserBookNotes };
