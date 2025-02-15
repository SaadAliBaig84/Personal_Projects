import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useLocation } from "react-router-dom";
const NewNotes = ({ book }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateNote = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!title.trim()) {
      setError("Document title is required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const currCookies = new Cookies();
      const jwt = currCookies.get("jwt");
      const response = await axios.post(
        "http://localhost:3000/notes/create-note",
        {
          title,
          bookTitle: book.title,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`, // Sending JWT in Authorization header
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Google Doc created successfully! Redirecting...");
        let newTab;
        // Open new tab and check if it's blocked
        setTimeout(() => {
          newTab = window.open(
            response.data.docUrl,
            "_blank"

            //   "noopener,noreferrer"
          );
        }, 1000);

        const checkTabClosed = setInterval(() => {
          if (newTab && newTab.closed) {
            clearInterval(checkTabClosed); // Stop checking
            window.location.reload(); // Refresh your app to load new notes
          }
        }, 1000);
        // Only navigate in the same tab if the new tab was blocked
        // if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        //   window.location.href = response.data.docUrl;
        // }
      } else {
        setError("Failed to create notes document.");
      }
    } catch (err) {
      setError("Error creating document. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };
  if (localStorage.getItem("googleVerified") === "true")
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create New Notes
        </h2>
        <h3 className="text-sm text-gray-600 mb-4">
          Book Title: <span className="font-semibold">{book.title}</span>
        </h3>
        <form onSubmit={handleCreateNote}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Document Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}
          <button type="submit" className="Buttons w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Notes"}
          </button>
        </form>
      </div>
    );
  else {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Please sign in with your google account to create new notes.
        </h2>
        <p className="text-gray-600"></p>
      </div>
    );
  }
};

export default NewNotes;
