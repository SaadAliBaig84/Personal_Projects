import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import GoogleDocModal from "./GoogleDocModal";
const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const currCookies = new Cookies();
        const jwt = currCookies.get("jwt");
        const response = await axios.get(
          `http://localhost:3000/notes/getUserNotes`,

          {
            headers: { Authorization: `Bearer ${jwt}` }, // Sending JWT for authentication
          }
        );
        console.log(response.data);
        if (response.data.notes !== null) {
          setNotes(response.data.notes);
        }
      } catch (error) {
        setError("Failed to fetch notes. Please try again.");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    if (localStorage.getItem("googleVerified") === "true") {
      fetchNotes();
    }
  }, []);

  if (localStorage.getItem("googleVerified") === "true")
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
          <ul className="list-disc list-inside space-y-4">
            {notes.map((note, index) => (
              <li key={index} className="text-indigo-700 font-semibold">
                📖 {note.book} {/* ✅ Display Book Title */}
                <ul className="list-decimal ml-4 text-indigo-500">
                  {note.notes.map((subNote, subIndex) => (
                    <li key={subIndex} className="mt-1">
                      📄 {subNote.name}
                      <button
                        className="Buttons"
                        type="button"
                        onClick={() => {
                          setSelectedNote(subNote);

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
  else {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Saved Notes
        </h2>
        <p className="text-gray-600">
          Please verify your google account to view notes.
        </p>
      </div>
    );
  }
};

export default AllNotes;
