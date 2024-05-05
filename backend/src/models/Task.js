import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  technologies: [String],
  deadline: Date,
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: String,
  fileAttachments: [String],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Task", taskSchema);
