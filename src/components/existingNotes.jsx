import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import GoogleDocModal from "./GoogleDocModal";
import { Trash2 } from "lucide-react";
import DeleteModal from "./deleteModal";
const ExistingNotes = ({ book }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  useEffect(() => {
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
                <button
                  type="button"
                  onClick={() => {
                    console.log(notes[0].googleDocId);
                    setSelectedNote(note);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="text-red-500 hover:text-red-700 transition-colors duration-300 hover:scale-110 " />
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

        {/* {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p className="text-gray-600 mt-2">
              This action cannot be undone. Your note will be permanently
              deleted.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true); // Show loader
                  console.log(selectedNote);
                  await onDelete(selectedNote.googleDocId);
                  setIsDeleting(false); // Hide loader
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                {isDeleting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )} */}

        {isDeleteModalOpen && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            googleDocId={selectedNote.googleDocId}
            setNotes={setNotes}
          ></DeleteModal>
        )}
      </div>
    );
  else {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Please sign in with your google account to view notes.
        </h2>
      </div>
    );
  }
};

export default ExistingNotes;
