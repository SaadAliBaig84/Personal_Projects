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

module.exports = { createGoogleDoc };
