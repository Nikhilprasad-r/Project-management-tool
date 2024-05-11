import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TeamCreation = () => {
  const [team, setTeam] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const result = await axios.get(`${process.env.VITE_API_URL}/admin/users`);
      setUsers(result.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };
  const fetchProjects = async () => {
    try {
      const result = await axios.get(
        `${process.env.VITE_API_URL}/admin/projects`
      );
      setProjects(result.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };
  const fetchTasks = async () => {
    try {
      const result = await axios.get(`${process.env.VITE_API_URL}/api/tasks`);
      setTasks(result.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchUsers();
    setLoading(false);
  }, []);

  return (
    <div>
      <h1>Team Creation</h1>
      <p>Team members:</p>
      <ul>
        {team.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamCreation;
