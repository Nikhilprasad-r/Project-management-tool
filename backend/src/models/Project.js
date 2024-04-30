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
});
export default mongoose.model("Project", projectSchema);
