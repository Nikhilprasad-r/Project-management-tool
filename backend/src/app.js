import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appRoutes from "./routes/appRoutes.js";

import { home } from "./controllers/homePage.js";

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors());

connectDB();

// Middleware
app.use(express.json(corsOptions));

// Routes
app.use("/", authRoutes);
app.use("/", appRoutes);
app.get("/", home);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
