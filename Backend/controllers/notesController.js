const { createGoogleDoc, deleteNoteUtil } = require("../Utils/docsUtils");
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
  console.log(userId);
  try {
    const userNotes = await Notes.find({ user: userId });
    console.log(userNotes);

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

const deleteUserNotes = async (req, res) => {};

const deleteBookNotes = async (req, res) => {};

// const deleteNote = async (req, res) => {
//   try {
//     const user = await User.findById(req.user);
//     if (!user) {
//       return res.status(400).send({ Error: "User not found" });
//     }

//     if (!user.google_data || !user.google_data.access_token) {
//       return res.status(400).send({ Error: "Google account not connected" });
//     }
//     console.log("Deleting note:", req.body.googleDocId);
//     console.log("User info:", user);
//     const status = await Notes.updateOne(
//       { user: user._id },
//       { $pull: { notes: { googleDocId: String(req.body.googleDocId) } } }
//     );
//     await deleteNoteUtil(user.google_data.access_token, req.body.googleDocId);

//     console.log("Status of deletion:", status);
//     res.status(200).send({ success: true });
//   } catch (error) {
//     console.error("❌ Error deleting document:", error);
//   }
// };
const deleteNote = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).send({ Error: "User not found" });
    }

    if (!user.google_data || !user.google_data.access_token) {
      return res.status(400).send({ Error: "Google account not connected" });
    }

    console.log("🔍 Deleting note:", req.body.googleDocId);

    // Fetch the Notes document before update
    const existingNotes = await Notes.find({ user: user._id });
    console.log(
      "📜 Existing Notes Before Deletion:",
      JSON.stringify(existingNotes, null, 2)
    );

    // Perform deletion
    await Notes.updateMany(
      { user: user._id, "notes.googleDocId": req.body.googleDocId },
      {
        $pull: {
          notes: { googleDocId: { $in: [req.body.googleDocId, null] } },
        },
      } // Ensure no null values remain
    );

    // Fetch updated Notes document after update
    const updatedNotes = await Notes.find({ user: user._id });
    console.log(
      "📜 Notes After Deletion:",
      JSON.stringify(updatedNotes, null, 2)
    );

    await deleteNoteUtil(user.google_data.access_token, req.body.googleDocId);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { createNote, getUserNotes, getUserBookNotes, deleteNote };
