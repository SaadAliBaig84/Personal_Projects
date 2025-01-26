import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token is found, redirect to login page
  if (!token) {
    console.log(token);
    return <Navigate to="/" replace />;
  }

  return children;  // If token is present, render the protected page
}

export default ProtectedRoute;
