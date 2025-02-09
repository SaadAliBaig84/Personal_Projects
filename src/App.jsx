import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import LoginPage from "./components/loginPage";
import ListInfo from "./components/listInfo";
import { Provider } from "react-redux";
import ProtectedRoute from "./components/protectedRoute";
import store from "./components/store";
import Notes from "./components/addNotes";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listInfo"
            element={
              <ProtectedRoute>
                <ListInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addNotes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
