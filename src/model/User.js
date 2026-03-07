import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'hr', 'coaching', 'consultant', 'teacher', 'non-teacher', 'school'],
    default: 'user'
  },
  isSuspended: { type: Boolean, default: false },
  suspensionEndDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
