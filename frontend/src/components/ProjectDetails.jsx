import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
const ProjectDetails = ({ project }) => {
  const [marks, setMarks] = useState(project.totalMarks || 0);
  const [evaluation, setEvaluation] = useState(project.evaluation || "");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (user.role === "tl") {
      const fetchData = async () => {
        try {
          const result = await axios.get(
            `${process.env.VITE_API_URL}/api/project/${project.id}`
          );
          setData(result.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      useNavigate("/");
    }
  });

  const completedTasks = project.tasks.filter(
    (task) => task.isCompleted
  ).length;
  const totalTasks = project.tasks.length;
  const completionPercentage = ((completedTasks / totalTasks) * 100).toFixed(0);

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleEvaluationChange = (e) => {
    setEvaluation(e.target.value);
  };

  const submitEvaluation = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        "http://your-api-url/api/admin/projects/evaluation",
        {
          projectId: project.id,
          totalMarks: marks,
          evaluation,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Evaluation updated successfully!");
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to update evaluation.");
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4">
      <h3 className="font-medium text-gray-800">{project.title}</h3>
      <p>{project.description}</p>
      <div className="text-sm text-gray-600">
        Completion: {completionPercentage}%
      </div>
      <ul className="list-disc list-inside">
        {project.tasks.map((task) => (
          <li
            key={task.id}
            className={`${
              task.isCompleted ? "text-green-500" : "text-red-500"
            }`}
          >
            {task.name}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Marks:
        </label>
        <input
          type="number"
          value={marks}
          onChange={handleMarksChange}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">
          Evaluation:
        </label>
        <textarea
          value={evaluation}
          onChange={handleEvaluationChange}
          rows="3"
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
        />
        <button
          onClick={submitEvaluation}
          disabled={submitting}
          className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Evaluation
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
