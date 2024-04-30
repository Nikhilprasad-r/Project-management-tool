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
});

export default mongoose.model("Task", taskSchema);
