const Note = require('../models/Note');
const path = require('path');
const fs = require('fs');

// @route   GET /api/notes
// @desc    Get all user notes for Idea Board
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error('getNotes error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving notes.' });
  }
};

// @route   POST /api/notes
// @desc    Create a new note with optional image upload
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const note = await Note.create({
      userId: req.user._id,
      title: title ? title.trim() : 'Story Idea',
      content: content ? content.trim() : '',
      image,
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully.',
      note,
    });
  } catch (error) {
    console.error('createNote error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating note.' });
  }
};

// @route   DELETE /api/notes/:id
// @desc    Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    if (note.image && note.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', note.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully.',
    });
  } catch (error) {
    console.error('deleteNote error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting note.' });
  }
};

module.exports = { getNotes, createNote, deleteNote };
