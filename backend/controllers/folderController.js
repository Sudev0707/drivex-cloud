const Folder = require("../models/Folder");
const DriveFile = require("../models/DriveFile");
const { getBaseUrl, toFolderDto } = require("../utils/serializers");

const FOLDER_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(folders.map(toFolderDto));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.create({
      user: req.user._id,
      name: name.trim(),
      color: FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
    });

    res.status(201).json(toFolderDto(folder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (req.body.name?.trim()) {
      folder.name = req.body.name.trim();
    }

    await folder.save();
    res.json(toFolderDto(folder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await DriveFile.updateMany(
      { user: req.user._id, folder: folder._id },
      { $set: { folder: null } },
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFolders, createFolder, updateFolder, deleteFolder };
