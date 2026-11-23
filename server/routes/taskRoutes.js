const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { handleUploadError } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', upload.single('image'), handleUploadError, createTask);
router.put('/:id', upload.single('image'), handleUploadError, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
