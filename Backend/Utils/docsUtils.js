const { google } = require("googleapis");

const createGoogleDoc = async (accessToken, docTitle) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const docs = google.docs({ version: "v1", auth: auth });
    const res = await docs.documents.create({
      title: docTitle,
    });
    return res.data.documentId;
  } catch (error) {
    console.error("❌ Error creating Google Doc:", error);
    throw new Error("Failed to create Google Doc");
  }
};

const deleteNoteUtil = async (accessToken, googleDocId) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: auth });
    console.log("Deleting doc:", googleDocId);
    const res = await drive.files.delete({
      fileId: googleDocId,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createGoogleDoc, deleteNoteUtil };
