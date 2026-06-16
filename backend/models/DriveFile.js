const mongoose = require("mongoose");

const driveFileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    fileName: { type: String, required: true, trim: true },
    fileType: { type: String, required: true },
    kind: {
      type: String,
      enum: ["image", "video", "audio", "pdf", "doc", "sheet", "slide", "archive", "code", "other"],
      default: "other",
    },
    fileSize: { type: Number, required: true },
    storageKey: { type: String, required: true },
    fileUrl: { type: String, required: true },
    isTrashed: { type: Boolean, default: false },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true },
);

driveFileSchema.index({ user: 1, isTrashed: 1 });
driveFileSchema.index({ user: 1, folder: 1 });

module.exports = mongoose.model("DriveFile", driveFileSchema);
