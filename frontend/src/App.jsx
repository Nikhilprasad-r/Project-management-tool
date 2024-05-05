import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProjectList from "./components/ProjectList";
import CreateProject from "./components/CreateProject";
import TaskList from "./components/TaskList";
import CreateTask from "./components/CreateTask";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/create-task" element={<CreateTask />} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
