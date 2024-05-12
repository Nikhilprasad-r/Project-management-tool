import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectForm from "../components/ProjectForm";

const TeamLeaderPanel = () => {
  const { user } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await axios.get(
        `${process.env.VITE_API_URL}/api/projects`
      );
      setProjects(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load projects.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === "tl") {
      fetchProjects();
    } else {
      navigate("/");
    }
  }, [user.role, navigate]);

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
  };

  return (
    <div>
      <h1>Team Leader Panel</h1>

      <h2 className="text-lg font-bold">Projects</h2>
      {isLoading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p>{error}</p>
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
          {selectedProjectId && (
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
