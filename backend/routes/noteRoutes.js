const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  uploadNote,
  getAllNotes,
  getMyNotes,
  getNoteById,
  deleteNote,
  updateNote,
  downloadNote,
} = require("../controllers/notesController");

// Upload Note
router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadNote
);

// Get All Notes
router.get("/", getAllNotes);

// Get My Notes
router.get("/my", protect, getMyNotes);

router.get("/:noteId", protect, getNoteById);

// Delete Note
router.delete("/:noteId", protect, deleteNote);

// Update Note
router.put("/:noteId", protect, updateNote);

// Download Note
router.get("/:noteId/download", downloadNote);

module.exports = router;