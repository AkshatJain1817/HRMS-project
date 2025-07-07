const express = require('express');
const router = express.Router();
const{
    createNote,
    getNotes,
    updateNote,
    deleteNote
} = require('../controllers/note.controller');
const protect = require('../middleware/auth.middleware');

router.post('/create', protect, createNote);
router.get('/get', protect, getNotes);
router.put('/update/:id', protect, updateNote);
router.delete('/delete/:id', protect, deleteNote);

module.exports = router;