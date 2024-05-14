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
  const { user, formMode, setFormMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const [projectData, userData] = await Promise.all([
          axios.get(`${process.env.VITE_API_URL}/admin/projects`),
          axios.get(`${process.env.VITE_API_URL}/admin/users`),
        ]);
        setProjects(projectData.data);
        setTeam(userData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, user]);

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
    setSelectedUserId(""); // Reset the user selection
    setFormMode("project");
  };

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
    setSelectedProjectId(""); // Reset the project selection
    setFormMode("user");
  };

  if (!user || !user.isAdmin) {
    return <div>Not authorized</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="container ml-[20%] px-4">
        <h1 className="text-xl font-bold text-center my-6">
          Hello Admin, {user.name}
        </h1>

        <h2 className="text-lg font-bold">Projects</h2>
        <select onChange={handleProjectSelect} value={selectedProjectId}>
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        {formMode === "project" && selectedProjectId && (
          <ProjectForm
            project={projects.find((p) => p._id === selectedProjectId)}
          />
        )}

        <h2 className="text-lg font-bold mt-6">Team Members</h2>
        <select onChange={handleUserSelect} value={selectedUserId}>
          <option value="">Select a user to view or edit</option>
          {team.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        {formMode === "user" && selectedUserId && (
          <UserForm user={team.find((u) => u._id === selectedUserId)} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
