const express = require("express");
const router = express.Router();
const Project = require("./models/Project");

// Create a project
router.post("/projects", async (req, res) => {
  const newProject = new Project(req.body);
  try {
    const savedProject = await newProject.save();
    res.status(201).send(savedProject);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a project
router.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete a project
router.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("Project has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});
