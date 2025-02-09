import React from "react";
import { X } from "lucide-react";
const GoogleDocModal = ({ googleDocId, onClose }) => {
  if (!googleDocId) return null; // Don't render if no document ID is provided

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 h-3/4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top right-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          <X />
        </button>

        {/* Google Docs Iframe */}
        <iframe
          src={`https://docs.google.com/document/d/${googleDocId}/preview`}
          width="100%"
          height="100%"
          className="rounded-b-lg"
          style={{ border: "none", borderRadius: "1rem 1rem 1rem 1rem" }}
        />
      </div>
    </div>
  );
};

export default GoogleDocModal;
