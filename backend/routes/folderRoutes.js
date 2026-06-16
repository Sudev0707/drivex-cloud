const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/folderController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFolders);
router.post("/", createFolder);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);

module.exports = router;
