import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
import { GoProjectSymlink } from "react-icons/go";
import ProjectForm from "../components/ProjectForm";
import UserForm from "../components/UserForm";

const Sidebar = () => {
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  return (
    <div>
      <aside
        id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li>
              <button
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => {
                  setCreatingUser(true);
                }}
              >
                <RiUserAddLine className="text-xl  text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span class="ms-3">Create User</span>
                <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </button>
            </li>
            <li>
              <button
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setCreatingProject(true)}
              >
                <GoProjectSymlink className="text-xl  text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span class="flex-1 ms-3 whitespace-nowrap">
                  Create Project
                </span>
                <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      {creatingProject && <ProjectForm />}
      {creatingUser && <UserForm />}
    </div>
  );
};

export default Sidebar;
