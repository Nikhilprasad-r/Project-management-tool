import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, required: true, default: "user", required: true },
  profilePic: { type: String },
  hourlyRate: { type: Number, required: true },
  skills: [{ type: String }],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
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
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const originalPassword = this.password;
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error("Error hashing password:", error);
      return next(error);
    }
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Password comparison failed");
  }
};

export default mongoose.model("User", UserSchema);
