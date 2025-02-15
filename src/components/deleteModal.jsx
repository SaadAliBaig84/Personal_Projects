import React, { useState } from "react";
import { Cookies } from "react-cookie";
import axios from "axios";
const onDelete = async (googleDocId, setNotes) => {
  try {
    const currCookies = new Cookies();
    const jwt = currCookies.get("jwt");
    await axios.post(
      `http://localhost:3000/notes/deleteNote`,
      {
        googleDocId,
      },
      {
        headers: { Authorization: `Bearer ${jwt}` }, // Sending JWT for authentication
      }
    );
    console.log("Note deleted successfully");
    console.log(googleDocId);
    setNotes((prevNotes) => {
      if (prevNotes.some((notes) => notes.notes === undefined)) {
        console.log("flat array");
        const filteredNotes = prevNotes.filter(
          (note) => note.googleDocId !== googleDocId
        );

        console.log(filteredNotes);
        return filteredNotes;
      } else {
        console.log("nested array");
        const filteredNotes = prevNotes
          .map((book) => ({
            ...book,
            notes: book.notes.filter(
              (note) => note.googleDocId !== googleDocId
            ),
          }))
          .filter((book) => book.notes.length > 0);
        console.log(filteredNotes);
        return filteredNotes;
      }
    });

    console.log("Note deleted successfully");
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

const DeleteModal = ({ isOpen, onClose, googleDocId, setNotes }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(googleDocId, setNotes);
    setIsDeleting(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold">Are you sure?</h2>
        <p className="text-gray-600 mt-2">
          This action cannot be undone. Your note will be permanently deleted.
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
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
  );
};

export default DeleteModal;
