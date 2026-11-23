const express = require('express');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { handleUploadError } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', upload.single('image'), handleUploadError, createProject);
router.put('/:id', upload.single('image'), handleUploadError, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
