import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  deadlines: Date,
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
  deploymentUrl: String,
  codebaseUrl: String,
  totalMarks: { type: Number, default: 0 },
  evaluation: { type: String, default: "" },
});

export default mongoose.model("Project", projectSchema);
