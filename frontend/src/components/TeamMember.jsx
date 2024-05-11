import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MdEditSquare } from "react-icons/md";
const TeamMember = () => {
  const { user, apiUrl } = useApp();
  const [tasks, setTasks] = useState([]);
  const fetchTask = async () => {
    const response = await axios.get(`${apiUrl}/api/tasks/user/${user.id}`);
    setTasks(response.data);
  };

  useEffect(() => {
    if (user) {
      fetchTask();
    } else {
      useNavigate("/login");
    }
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Task name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Deadline
              </th>
              <th scope="col" className="px-6 py-3">
                View/edit
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={task.id}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {task.taskName}
                </th>
                <td className="px-6 py-4">{task.status}</td>
                <td className="px-6 py-4">{task.deadline}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      viewTask(task.id);
                    }}
                  >
                    <MdEditSquare />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMember;
