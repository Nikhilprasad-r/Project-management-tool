import React from "react";
import { useApp } from "../context/AppContext";
const ProjectList = () => {
  const { projects } = useApp();
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Projects</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Deadlines</th>
              <th className="px-4 py-2">Deployment</th>
              <th className="px-4 py-2">Codebase</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{project.title}</td>
                <td className="border px-4 py-2">{project.description}</td>
                <td className="border px-4 py-2">{project.category}</td>
                <td className="border px-4 py-2">{project.deadlines}</td>
                <td className="border px-4 py-2">{project.deploymentUrl}</td>
                <td className="border px-4 py-2">{project.codebaseUrl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
