import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: String,
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
  completedAt: {
    type: Date,
    default: null,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Task", taskSchema);
