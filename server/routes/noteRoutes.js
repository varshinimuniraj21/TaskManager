const express = require('express');
const { getNotes, createNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { handleUploadError } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.post('/', upload.single('image'), handleUploadError, createNote);
router.delete('/:id', deleteNote);

module.exports = router;
