import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  const { teamLeaderId, ...projectData } = req.body;
  const newProject = new Project({ ...projectData, teamLeader: teamLeaderId });

  try {
    const savedProject = await newProject.save();
    const updatedUser = await User.findByIdAndUpdate(
      teamLeaderId,
      {
        $push: { projects: savedProject._id },
      },
      { new: true }
    );

    res.status(201).send(savedProject);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getallProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
};
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
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("Project has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
};
export const taskCreation = async (req, res) => {
  const { projectId, assignedTo, ...taskData } = req.body;
  const newTask = new Task({ ...taskData, projectId, assignedTo });

  try {
    const savedTask = await newTask.save();

    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: savedTask._id },
    });

    await User.updateMany(
      { _id: { $in: assignedTo } },
      { $push: { tasks: savedTask._id } }
    );

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
export const getTasksByProjectId = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getTasksByCategory = async (req, res) => {
  try {
    const tasks = await Task.find({ category: req.params.category });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};
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
export const completeTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completedAt: new Date() } },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const completeProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectid,
      { $set: { completedAt: new Date() } },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json(error);
  }
};
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
