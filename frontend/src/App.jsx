import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Home from "./components/Home";
// import ProjectList from "./components/ProjectList";
// import TaskList from "./components/TaskList";
// import CreateTask from "./components/CreateTask";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AccountActivation from "./components/AccountActivation";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
// import TaskDetails from "./components/TaskDetails";
import ProjectForm from "./components/ProjectForm";
import Navbar from "./components/ui/Navbar";
import Sidebar from "./components/ui/Sidebar";

function App() {
  return (
    <Router>
      <AppProvider>
        <Navbar />

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/activate/:token" element={<AccountActivation />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />

          <Route path="/" element={<Home />} />

          {/* <Route path="/admin" element={<AdminPanel />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />*/}
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
