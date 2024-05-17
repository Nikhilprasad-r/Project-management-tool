import express from "express";
import auth from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import isTl from "../middleware/isTl.js";
import {
  createProject,
  deleteProject,
  getProjects,
  projectUpdate,
  taskCreation,
  deleteTask,
  getTasks,
  taskUpdate,
  getAllUsersWithProjects,
  updateProjectEvaluation,
  getTasksByCategory,
  getTaskById,
  getTasksByProjectId,
  getTasksByUser,
  completeProject,
  getallProjects,
} from "../controllers/appControllers.js";

const router = express.Router();

// Project routes
router.get("/admin/users-projects", auth, isAdmin, getAllUsersWithProjects);
router.get("/admin/projects", auth, isAdmin, getallProjects);
router.get("/api/projects", auth, isTl, getProjects);
router.post("/api/project", auth, isAdmin, createProject);
router.put("/api/project/:id", auth, isTl, projectUpdate);
router.delete("/api/project/:id", auth, isAdmin, deleteProject);
router.post(
  "/project/project/completion/:projectid",
  auth,
  isTl,
  completeProject
);
router.post(
  "/admin/projects/evaluation",
  auth,
  isAdmin,
  updateProjectEvaluation
);

// Task routes
router.post("/api/task", auth, isTl, taskCreation);
router.put("/api/task/:id", auth, taskUpdate);
router.get("/api/tasks", auth, isTl, getTasks);
router.delete("/api/tasks/:id", auth, isTl, deleteTask);
router.get("/api/tasks/category/:category", auth, isTl, getTasksByCategory);
router.get("/api/task/id/:id", auth, isTl, getTaskById);
router.get("/api/tasks/project/:projectid", auth, isTl, getTasksByProjectId);
router.get("/api/tasks/user/:userid", auth, getTasksByUser);

export default router;
