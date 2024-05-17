import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: String,
  description: String,
  deadline: Date,
  category: String,
  fileAttachments: [String],
  versionBranch: {
    type: String,
    default: null,
  },
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
  comments: [
    {
      comment: String,
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      commentedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  cost: { type: Number, default: 0 },
});

export default mongoose.model("Task", taskSchema);
