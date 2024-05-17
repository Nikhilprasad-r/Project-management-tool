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

export default router;
