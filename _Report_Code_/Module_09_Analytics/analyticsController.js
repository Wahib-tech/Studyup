const Performance = require('../models/Performance');
const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const TodoTask = require('../models/TodoTask');
const Quiz = require('../models/Quiz');
const Notification = require('../models/Notification');

const getStudentAnalytics = async (req, res) => {
  const student_id = req.user.linked_id || req.user.id;
  try {
    const performances = await Performance.find({ student_id }).populate('quiz_id');
    const grades = await Grade.find({ student_id });
    
    // Skill breakdown by difficulty
    const skillStats = {
        easy: { sum: 0, count: 0 },
        medium: { sum: 0, count: 0 },
        hard: { sum: 0, count: 0 }
    };

    performances.forEach(p => {
        const diff = p.quiz_id?.difficulty_level || 'medium';
        if (skillStats[diff]) {
            skillStats[diff].sum += p.percentage;
            skillStats[diff].count += 1;
        }
    });

    const categories = Object.keys(skillStats).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1) + ' Mastery',
        value: skillStats[key].count > 0 ? Math.round(skillStats[key].sum / skillStats[key].count) : 0
    }));
    
    const avgScore = performances.length > 0 
      ? performances.reduce((acc, p) => acc + p.percentage, 0) / performances.length 
      : 0;

    res.json({
      performances,
      grades,
      categories,
      stats: {
        total_quizzes: performances.length,
        average_quiz_score: avgScore,
        courses_enrolled: grades.length
      }
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const students = await Student.find();
    const performances = await Performance.find();
    
    const totalStudents = students.length;
    const avgScore = performances.length > 0
      ? performances.reduce((acc, p) => acc + p.percentage, 0) / performances.length
      : 0;

    const studentStats = await Promise.all(students.map(async (s) => {
        const pList = await Performance.find({ student_id: s._id });
        const avg = pList.length > 0 ? pList.reduce((acc, p) => acc + p.percentage, 0) / pList.length : 0;
        return {
            name: `${s.first_name} ${s.last_name}`,
            avgScore: avg.toFixed(1),
            completion: Math.min(100, (pList.length / 10) * 100)
        };
    }));

    res.json({
      stats: {
        total_students: totalStudents,
        average_quiz_score: avgScore,
        courses_enrolled: 12
      },
      students: studentStats
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getStudentAnalytics, getAdminAnalytics };
