import Project from "../models/Project.js";
// Create a project
export const createProject = async (req, res) => {
  const newProject = new Project({ ...req.body, teamLeader: req.user._id });

  try {
    const savedProject = await newProject.save();
    res.status(201).send(savedProject);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all projects

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ teamLeader: req.user._id }).populate(
      "tasks"
    );
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a project

export const projectUpdate = async (req, res) => {
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
};

// Delete a project

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("Project has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const taskCreation = async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a task
export const taskUpdate = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json("Task has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getAllUsersWithProjects = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  try {
    const users = await User.find().populate({
      path: "projects",
      populate: { path: "tasks" },
    });
    res.json(users);
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
export const updateProjectEvaluation = async (req, res) => {
  const { projectId, totalMarks, evaluation } = req.body;
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { totalMarks: totalMarks, evaluation: evaluation } },
      { new: true }
    );
    if (project) {
      res.json({ msg: "Project evaluation updated successfully", project });
    } else {
      res.status(404).json({ msg: "Project not found" });
    }
  } catch (error) {
    console.error("Error updating project evaluation:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
