const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const DriveFile = require("../models/DriveFile");
const Folder = require("../models/Folder");
const detectKind = require("../utils/detectKind");
const { uploadDir } = require("../config/upload");
const { getBaseUrl, toFileDto } = require("../utils/serializers");

async function getUsedBytes(userId) {
  const result = await DriveFile.aggregate([
    { $match: { user: userId, isTrashed: false } },
    { $group: { _id: null, total: { $sum: "$fileSize" } } },
  ]);
  return result[0]?.total || 0;
}

async function assertFolderOwnership(userId, folderId) {
  if (!folderId) return null;
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const error = new Error("Invalid folder id");
    error.status = 400;
    throw error;
  }
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    const error = new Error("Folder not found");
    error.status = 404;
    throw error;
  }
  return folder;
}

function deletePhysicalFile(userId, storageKey) {
  const filePath = path.join(uploadDir, userId.toString(), storageKey);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const getFiles = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.trashed === "true") {
      filter.isTrashed = true;
    } else if (req.query.trashed === "false") {
      filter.isTrashed = false;
    } else if (req.query.shared === "true") {
      filter.isShared = true;
      filter.isTrashed = false;
    }

    const files = await DriveFile.find(filter).sort({ createdAt: -1 });
    const baseUrl = getBaseUrl(req);
    res.json(files.map((file) => toFileDto(file, baseUrl)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderId = req.body.folderId || null;
    await assertFolderOwnership(req.user._id, folderId);

    const used = await getUsedBytes(req.user._id);
    const limit = (req.user.storageLimitMb || 2048) * 1024 * 1024;
    if (used + req.file.size > limit) {
      deletePhysicalFile(req.user._id, req.file.filename);
      return res.status(400).json({ message: "Storage limit exceeded" });
    }

    const file = await DriveFile.create({
      user: req.user._id,
      folder: folderId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype || "application/octet-stream",
      kind: detectKind(req.file.mimetype, req.file.originalname),
      fileSize: req.file.size,
      storageKey: req.file.filename,
      fileUrl: `/uploads/${req.user._id}/${req.file.filename}`,
    });

    const baseUrl = getBaseUrl(req);
    res.status(201).json(toFileDto(file, baseUrl));
  } catch (error) {
    if (req.file) {
      deletePhysicalFile(req.user._id, req.file.filename);
    }
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const file = await DriveFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (req.body.fileName?.trim()) {
      file.fileName = req.body.fileName.trim();
    }

    if (req.body.folderId !== undefined) {
      await assertFolderOwnership(req.user._id, req.body.folderId || null);
      file.folder = req.body.folderId || null;
    }

    if (typeof req.body.isTrashed === "boolean") {
      file.isTrashed = req.body.isTrashed;
    }

    if (typeof req.body.isShared === "boolean") {
      file.isShared = req.body.isShared;
    }

    await file.save();
    res.json(toFileDto(file, getBaseUrl(req)));
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const trashFile = async (req, res) => {
  try {
    const file = await DriveFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isTrashed = true;
    await file.save();
    res.json(toFileDto(file, getBaseUrl(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreFile = async (req, res) => {
  try {
    const file = await DriveFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isTrashed = false;
    await file.save();
    res.json(toFileDto(file, getBaseUrl(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleShare = async (req, res) => {
  try {
    const file = await DriveFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isShared = !file.isShared;
    await file.save();
    res.json(toFileDto(file, getBaseUrl(req)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFilePermanent = async (req, res) => {
  try {
    const file = await DriveFile.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    deletePhysicalFile(req.user._id, file.storageKey);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFiles,
  uploadFile,
  updateFile,
  trashFile,
  restoreFile,
  toggleShare,
  deleteFilePermanent,
};
