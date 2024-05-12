import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import TaskDetails from "../components/TaskDetails";
import Sidebar from "../ui/Sidebar";

const DeveloperPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { user } = useApp();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const result = await axios.get(
        `${process.env.VITE_API_URL}/api/tasks/user/${user._id}`
      );
      setTasks(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const handleTaskSelect = (e) => {
    setSelectedTaskId(e.target.value);
  };

  return (
    <div>
      <Sidebar />
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold text-center my-6">
          Hello Developer, {user.name}
        </h1>
        <h2 className="text-lg font-bold">Tasks</h2>
        <select onChange={handleTaskSelect} value={selectedTaskId}>
          <option value="">Select a task</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.taskName}
            </option>
          ))}
        </select>
        {selectedTaskId && (
          <TaskDetails
            task={tasks.find((task) => task._id === selectedTaskId)}
          />
        )}
      </div>
    </div>
  );
};

export default DeveloperPanel;
