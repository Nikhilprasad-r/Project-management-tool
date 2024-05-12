import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectForm from "../components/ProjectForm";
import UserForm from "../components/UserForm";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../ui/Sidebar";

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [team, setTeam] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const result = await axios.get(
        `${process.env.VITE_API_URL}/admin/projects`
      );
      setProjects(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await axios.get(`${process.env.VITE_API_URL}/admin/users`);
      setTeam(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user.isAdmin) {
      fetchProjects();
      fetchUsers();
    } else {
      navigate("/");
    }
  }, [navigate, user.isAdmin]);

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div>
      <Sidebar />
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold text-center my-6">
          Hello Admin, {user.name}
        </h1>
        <button
          onClick={() => setCreatingProject(true)}
          className="btn-primary"
        >
          Create New Project
        </button>
        {creatingProject && <ProjectForm />}

        <h2 className="text-lg font-bold">Projects</h2>
        <select onChange={handleProjectSelect} value={selectedProjectId}>
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        {selectedProjectId && (
          <ProjectForm
            project={projects.find((p) => p._id === selectedProjectId)}
          />
        )}

        <button onClick={() => setCreatingUser(true)} className="btn-primary">
          Create New User
        </button>
        {creatingUser && <UserForm />}

        <h2 className="text-lg font-bold mt-6">Team Members</h2>
        <select onChange={handleUserSelect} value={selectedUserId}>
          <option value="">Select a user to view or edit</option>
          {team.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        {selectedUserId && (
          <UserForm user={team.find((u) => u._id === selectedUserId)} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
