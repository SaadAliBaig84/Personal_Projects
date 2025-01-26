import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import LoginPage from "./components/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ListInfo from "./components/listInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/listInfo" element={<ListInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
