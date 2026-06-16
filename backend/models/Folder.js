const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "#3b82f6" },
  },
  { timestamps: true },
);

folderSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model("Folder", folderSchema);
