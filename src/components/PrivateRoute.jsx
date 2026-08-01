import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  // Jika tidak ada token, lempar ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang dibungkusnya
  return children;
}