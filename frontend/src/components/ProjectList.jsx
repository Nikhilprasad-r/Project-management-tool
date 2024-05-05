import React from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const { projects } = useApp();
  const navigate = useNavigate();

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

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
              <th className="px-4 py-2">Tasks</th>
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
                <td className="border px-4 py-2">
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => handleTaskClick(task._id)}
                      >
                        {task.name}
                      </div>
                    ))
                  ) : (
                    <span>No Tasks</span>
                  )}
                </td>
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
