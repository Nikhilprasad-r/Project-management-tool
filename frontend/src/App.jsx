import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AccountActivation from "./components/AccountActivation";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
import Navbar from "./ui/Navbar";
import AdminPanel from "./pages/AdminPanel";
import TeamLeaderPanel from "./pages/TeamLeaderPanel";
import DeveloperPanel from "./pages/DeveloperPanel";

function App() {
  return (
    <Router>
      <AppProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/activate/:token" element={<AccountActivation />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/teamleader" element={<TeamLeaderPanel />} />
          <Route path="/developer" element={<DeveloperPanel />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
