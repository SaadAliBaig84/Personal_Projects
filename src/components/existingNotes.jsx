import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import GoogleDocModal from "./GoogleDocModal";
const ExistingNotes = ({ book }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const currCookies = new Cookies();
        const jwt = currCookies.get("jwt");
        const bookTitle = book.title;
        const response = await axios.post(
          `http://localhost:3000/notes/getUserBookNotes`,
          {
            bookTitle,
          },
          {
            headers: { Authorization: `Bearer ${jwt}` }, // Sending JWT for authentication
          }
        );
        if (response.data.notes !== null) {
          setNotes(response.data.notes.notes);
        }
      } catch (error) {
        setError("Failed to fetch notes. Please try again.");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Your Saved Notes
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading notes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-600">No notes found. Create one now!</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {notes.map((note, index) => (
            <li key={index} className="text-indigo-600 ">
              📄 {note.name}
              <button
                className="Buttons"
                type="button"
                onClick={() => {
                  setSelectedNote(note);

                  setIsModalOpen(true);
                }}
              >
                Preview
              </button>
              <button
                className="Buttons"
                type="button"
                onClick={() =>
                  window.open(
                    `https://docs.google.com/document/d/${selectedNote.googleDocId}/edit`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && selectedNote !== null && (
        <GoogleDocModal
          googleDocId={selectedNote.googleDocId}
          onClose={() => setIsModalOpen(false)}
        >
          <iframe
            src={`https://docs.google.com/document/d/${selectedNote.googleDocId}/preview`}
            title={selectedNote.name}
            className="w-full h-screen"
            style={{ border: "none" }}
          ></iframe>
        </GoogleDocModal>
      )}
    </div>
  );
};

export default ExistingNotes;
