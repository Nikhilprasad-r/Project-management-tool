import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import TaskDetails from "../components/TaskDetails";

const DeveloperPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setFormMode, formMode, apiCall } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const result = await apiCall("get", `/api/tasks/user/${user._id}`);
        setTasks(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, navigate, apiCall]);

  const handleTaskSelect = (e) => {
    setSelectedTaskId(e.target.value);
    setFormMode("task");
  };

  if (!user) return <div>Redirecting...</div>;

  return (
    <div className="mt-14 p-6">
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold text-center my-6 capitalize">
          Hello Developer, {user.name}
        </h1>
        <h2 className="text-lg font-bold">Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <select onChange={handleTaskSelect} value={selectedTaskId}>
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.taskName}
              </option>
            ))}
          </select>
        )}
        {selectedTaskId && formMode === "task" && (
          <TaskDetails
            task={tasks.find((task) => task._id === selectedTaskId)}
          />
        )}
      </div>
    </div>
  );
};

export default DeveloperPanel;
