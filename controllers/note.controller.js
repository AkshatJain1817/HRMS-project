const Note = require('../models/notes.model');

exports.createNote = async (req, res) => {
    try{
        const { content } = req.body;
        const userId = req.user.id;

        const newNote = new Note({
            userId,
            content
        });
        await newNote.save();
        res.status(201).json(newNote);
    }catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await Note.find({ userId });
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateNote = async (req, res) => {
    try{
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    }catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}