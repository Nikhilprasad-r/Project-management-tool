import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectForm from "../components/ProjectForm";

const TeamLeaderPanel = () => {
  const { user, formMode, setFormMode } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchProjects = async () => {
    try {
      const result = await axios.get(
        `${process.env.VITE_API_URL}/api/projects`
      );
      setProjects(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "tl") {
      navigate("/");
      return;
    }

    fetchProjects();
  }, [user, navigate]);

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
    setFormMode("project");
  };

  if (!user) return <div>Checking authorization...</div>;

  return (
    <div className="ml-[30%]">
      <h1>Team Leader Panel</h1>

      <h2 className="text-lg font-bold">Projects</h2>
      {isLoading ? (
        <p>Loading projects...</p>
      ) : error || projects ? (
        <p className="text-red-500">No projects found</p>
      ) : (
        <>
          <select onChange={handleProjectSelect} value={selectedProjectId}>
            <option value="">Select a project</option>
            {projects.length > 0 ? (
              projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))
            ) : (
              <option disabled>No projects found</option>
            )}
          </select>
          {selectedProjectId && formMode === "project" && (
            <ProjectForm
              project={projects.find((p) => p._id === selectedProjectId)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TeamLeaderPanel;
