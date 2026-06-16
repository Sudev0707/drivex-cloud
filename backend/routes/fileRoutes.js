const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../config/upload");
const {
  getFiles,
  uploadFile,
  updateFile,
  trashFile,
  restoreFile,
  toggleShare,
  deleteFilePermanent,
} = require("../controllers/fileController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.put("/:id", updateFile);
router.patch("/:id/trash", trashFile);
router.patch("/:id/restore", restoreFile);
router.patch("/:id/share", toggleShare);
router.delete("/:id", deleteFilePermanent);

module.exports = router;
