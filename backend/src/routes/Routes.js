import express from "express";
import auth from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
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

//app routes
router.get("/api/projects", auth, getProjects);
router.post("/api/project", auth, isAdmin, createProject);
router.put("/api/project/:id", auth, projectUpdate);
router.delete("/api/project/:id", auth, isAdmin, deleteProject);
router.post("/api/tasks", auth, taskCreation);
router.get("/api/tasks", auth, getTasks);
router.get("/api/tasks/:category", auth, getTasksByCategory);
router.get("/api/tasks/:id", auth, getTaskById);
router.get("/api/tasks/:projectid", auth, getTasksByProjectId);
router.put("/api/tasks/:id", auth, taskUpdate);
router.delete("/api/tasks/:id", auth, isAdmin, deleteTask);
router.get("/admin/users-projects", auth, isAdmin, getAllUsersWithProjects);
router.post(
  "/admin/projects/evaluation",
  auth,
  isAdmin,
  updateProjectEvaluation
);
export default router;
