import express from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  submitNewPassword,
  activateAccount,
  validateToken,
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
} from "../controllers/appControllers.js";
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/reset/:token", submitNewPassword);
router.post("/auth/activate/:token", activateAccount);
router.get("/auth/validatetoken", auth, validateToken);
router.get("/api/projects", auth, getProjects);
router.post("/api/project", auth, createProject);
router.put("/api/project/:id", auth, projectUpdate);
router.delete("/api/project/:id", auth, deleteProject);
router.post("/api/tasks", taskCreation);
router.get("/api/tasks", getTasks);
router.put("/api/tasks/:id", taskUpdate);
router.delete("/api/tasks/:id", deleteTask);
export default router;
