import React from "react";
import { useApp } from "../context/AppContext";
const TaskList = () => {
  const { tasks } = useApp();
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Technologies</th>
              <th className="px-4 py-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{task.projectName}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">
                  {task.technologies.join(", ")}
                </td>
                <td className="border px-4 py-2">{task.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
