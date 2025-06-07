import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  submainId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubMain",
  },
  username: {
    type: String,
    trim: true,
  },

  date: {
    type: Date,
  },

  tasks: {
    type: String,
    trim: true,
  },

  remainingWork: {
    type: String,
    trim: true,
  },
  number: {
    type: Number,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // optional: adds createdAt and updatedAt automatically
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;