import React, { useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
import { GoProjectSymlink } from "react-icons/go";
import ProjectForm from "../components/ProjectForm";
import UserForm from "../components/UserForm";
import { useApp } from "../context/AppContext";

const Sidebar = ({ teamLeaders }) => {
  const { formMode, setFormMode } = useApp();

  return (
    <div>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => {
                  setFormMode("createUser");
                }}
              >
                <RiUserAddLine className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Create User</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </button>
            </li>
            <li>
              <button
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setFormMode("createProject")}
              >
                <GoProjectSymlink className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Create Project
                </span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      {formMode === "createProject" && (
        <ProjectForm teamLeaders={teamLeaders} />
      )}
      {formMode === "createUser" && <UserForm />}
    </div>
  );
};

export default Sidebar;
