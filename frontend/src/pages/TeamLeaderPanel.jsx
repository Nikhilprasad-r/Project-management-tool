import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectForm from "../components/ProjectForm";

const TeamLeaderPanel = () => {
  const { user, formMode, setFormMode, apiCall } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const result = await apiCall("get", `/api/tl/projects`);
      setProjects(result);
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
  }, [user, navigate, apiCall]);

  const handleProjectSelect = (e) => {
    setSelectedProjectId(e.target.value);
    setFormMode("project");
  };

  if (!user) return <div>Checking authorization...</div>;

  return (
    <div className="mt-14 p-6">
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold text-center my-6 capitalize">
          Team TeamLeader {user.name}
        </h1>

        <h2 className="text-lg font-bold">Projects</h2>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
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
    </div>
  );
};

export default TeamLeaderPanel;
