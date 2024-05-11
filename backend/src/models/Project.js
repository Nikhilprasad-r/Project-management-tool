import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  deadlines: Date,
  technologies: [String],
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  completedAt: {
    type: Date,
    default: null,
  },
  totalManDays: { type: Number, default: 0 },
  deploymentUrl: String,
  codebaseUrl: String,
  totalMarks: { type: Number, default: 0 },
  evaluation: {
    type: String,
    default: "pending",
  },
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

export default mongoose.model("Project", projectSchema);
