import express from "express";
import auth from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import isTl from "../middleware/isTl.js";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  submitNewPassword,
  activateAccount,
  validateToken,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";
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
//auth routes
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/reset/:token", submitNewPassword);
router.post("/auth/activate/:token", activateAccount);
router.get("/auth/validatetoken", auth, validateToken);
//user management routes
router.post("/admin/create-user", auth, isAdmin, createUser);
router.get("/admin/users", auth, isAdmin, getUsers);
router.put("/admin/user/:id", auth, updateUser);
router.delete("/admin/user/:id", auth, isAdmin, deleteUser);
router.get("/admin/users-projects", auth, isAdmin, getAllUsersWithProjects);
router.get("/admin/projects", auth, isAdmin, getallProjects);
//project routes
router.get("/api/projects", auth, isTl, getProjects);
router.post("/api/project", auth, isAdmin, createProject);
router.put("/api/project/:id", auth, isTl, projectUpdate);
router.delete("/api/project/:id", auth, isAdmin, deleteProject);
router.post(
  "project/project/completion/:projectid",
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
//task routes
router.post("/api/task", auth, isTl, taskCreation);
router.put("/api/task/:id", auth, taskUpdate);
router.get("/api/tasks", auth, isTl, getTasks);
router.delete("/api/tasks/:id", auth, isTl, deleteTask);

//task category routes
router.get("/api/tasks/category/:category", auth, isTl, getTasksByCategory);
router.get("/api/task/id/:id", auth, isTl, getTaskById);
router.get("/api/tasks/project/:projectid", auth, isTl, getTasksByProjectId);
router.get("/api/tasks/user/:userid", auth, getTasksByUser);

export default router;
