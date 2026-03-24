const Subject = require('../models/Subject');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ created_by: req.user.id }).populate('course_id');
    res.json(subjects);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSubject = async (req, res) => {
  try {
    req.body.created_by = req.user.id;
    const subject = await Subject.create(req.body);
    const populated = await Subject.findById(subject._id).populate('course_id');
    res.status(201).json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, created_by: req.user.id },
            req.body,
            { new: true }
        ).populate('course_id');
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, created_by: req.user.id });
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
