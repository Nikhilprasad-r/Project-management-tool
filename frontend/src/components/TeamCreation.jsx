import React, { useEffect } from "react";

const TeamCreation = () => {
  const [team, setTeam] = useState([]);
  useEffect(
    async() => {
      try {
        const result = await axios.get(`${process.env.VITE_API_URL}/admin/users`);
        setTeam(result.data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
   
  })[];





  return <div></div>;
};

export default TeamCreation;
