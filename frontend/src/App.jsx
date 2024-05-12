import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AccountActivation from "./pages/AccountActivation";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import Navbar from "./ui/Navbar";
import AdminPanel from "./pages/AdminPanel";
import TeamLeaderPanel from "./pages/TeamLeaderPanel";
import DeveloperPanel from "./pages/DeveloperPanel";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <AppProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
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
