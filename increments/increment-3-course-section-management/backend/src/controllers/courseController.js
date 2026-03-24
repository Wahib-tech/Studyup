const Course = require('../models/Course');
const Section = require('../models/Section');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('course_id');
    res.json(sections);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getCourses, createCourse, getSections, createSection };
