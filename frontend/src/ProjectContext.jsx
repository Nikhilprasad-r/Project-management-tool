import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("/api/projects");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get("/api/tasks");
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProjects();
    fetchTasks();
  }, []);

  const addProject = async (project) => {
    try {
      const { data } = await axios.post("/api/projects", project);
      setProjects((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id, project) => {
    try {
      const { data } = await axios.put(`/api/projects/${id}`, project);
      setProjects((prev) =>
        prev.map((item) => (item._id === id ? data : item))
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addTask = async (task) => {
    try {
      const { data } = await axios.post("/api/tasks", task);
      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      const { data } = await axios.put(`/api/tasks/${id}`, task);
      setTasks((prev) => prev.map((item) => (item._id === id ? data : item)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
