import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectDetails from "./ProjectDetails";

const AdminPanel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${process.env.VITE_API_URL}/api/projects`
        );
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold text-center my-6">
        Admin Panel: User Projects Overview
      </h1>
      {data.map((user) => (
        <div key={user.id}>
          <h2 className="text-lg font-semibold">{user.name}'s Projects</h2>
          {user.projects.map((project) => (
            <ProjectDetails key={project.id} project={project} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
