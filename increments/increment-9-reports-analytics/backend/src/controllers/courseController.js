const Course = require('../models/Course');
const Section = require('../models/Section');
const { getIO } = require('../utils/socket');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    console.log('Sending Courses to Frontend:', courses.length);
    res.json(courses);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, created_by: req.user._id });
    getIO().emit('courses_changed');
    res.status(201).json(course);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('course_id');
    console.log('Sending Sections to Frontend:', sections.length);
    res.json(sections);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSection = async (req, res) => {
  try {
    const section = await Section.create({ ...req.body, created_by: req.user._id });
    getIO().emit('sections_changed');
    res.status(201).json(section);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findOneAndDelete({ _id: id, created_by: req.user._id });
    // Also delete sections associated with this course
    await Section.deleteMany({ course_id: id, created_by: req.user._id });
    getIO().emit('courses_changed');
    getIO().emit('sections_changed');
    res.json({ message: 'Course and related sections deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await Section.findOneAndDelete({ _id: id, created_by: req.user._id });
    getIO().emit('sections_changed');
    res.json({ message: 'Section deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getCourses, createCourse, getSections, createSection, deleteCourse, deleteSection };
