const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const Subject = require('./src/models/Subject');
const TodoTask = require('./src/models/TodoTask');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');
const Quiz = require('./src/models/Quiz');
const Student = require('./src/models/Student');
const Grade = require('./src/models/Grade');

dotenv.config();

const seedDashboardData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the admin user
        let user = await User.findOne({ username: 'admin' });
        if (!user) {
            console.log('Admin user not found. Run seed-admin-inc9.js first.');
            process.exit();
        }

        // 1. Create a sample Course
        let course = await Course.findOne();
        if (!course) {
            course = await Course.create({
                course_name: 'Computer Science',
                course_code: 'CS101',
                description: 'Foundation course for CS'
            });
            console.log('Created sample course');
        }

        // 2. Create a sample Student record for the admin (to have a linked_id)
        let student = await Student.findOne({ email: user.email });
        if (!student) {
            student = await Student.create({
                first_name: 'Admin',
                last_name: 'User',
                email: user.email,
                course_id: course._id,
                status: 'active'
            });
            user.linked_id = student._id;
            await user.save();
            console.log('Created student record for admin and linked it');
        }

        // 3. Create sample Subjects
        const subjects = [
            { subject_name: 'Data Structures', subject_code: 'CS201', course_id: course._id, semester: 3 },
            { subject_name: 'Algorithms', subject_code: 'CS202', course_id: course._id, semester: 3 },
            { subject_name: 'Database Management', subject_code: 'CS301', course_id: course._id, semester: 4 }
        ];

        for (const s of subjects) {
            const exists = await Subject.findOne({ subject_code: s.subject_code });
            if (!exists) {
                await Subject.create(s);
                console.log(`Created subject: ${s.subject_name}`);
            }
        }

        const studentIdToUse = student._id;
        const allSubs = await Subject.find();

        // 4. Create sample Tasks
        const tasks = [
            { title: 'Finish Linked List Assignment', status: 'pending', student_id: studentIdToUse },
            { title: 'Read Chapter 4 of DBMS', status: 'pending', student_id: studentIdToUse },
            { title: 'Watch AI Lecture', status: 'completed', student_id: studentIdToUse }
        ];

        for (const t of tasks) {
            const exists = await TodoTask.findOne({ title: t.title, student_id: studentIdToUse });
            if (!exists) {
                await TodoTask.create(t);
                console.log(`Created task: ${t.title}`);
            }
        }

        // 5. Create sample Notifications
        const notifications = [
            { title: 'Welcome to StudyUp', message: 'Get started by creating your first AI quiz!', student_id: studentIdToUse, read_status: false, type: 'system' },
            { title: 'New Course Available', message: 'A new course "Machine Learning" has been added.', student_id: studentIdToUse, read_status: false, type: 'system' }
        ];

        for (const n of notifications) {
            const exists = await Notification.findOne({ title: n.title, student_id: studentIdToUse });
            if (!exists) {
                await Notification.create(n);
                console.log(`Created notification: ${n.title}`);
            }
        }

        // 6. Create sample Quizzes
        for (const qData of [
            { title: 'Physics Basics', question_count: 5 },
            { title: 'Math Fundamentals', question_count: 10 }
        ]) {
            const exists = await Quiz.findOne({ title: qData.title });
            if (!exists) {
                await Quiz.create({
                    ...qData,
                    subject_id: allSubs[0]._id,
                    created_by: user._id,
                    questions: []
                });
                console.log(`Created quiz: ${qData.title}`);
            }
        }

        // 7. Create sample Grades
        const grades = [
            { 
                student_id: studentIdToUse, 
                subject_id: allSubs[0]._id, 
                semester: 3, 
                academic_year: '2023-24', 
                marks_obtained: 85, 
                total_marks: 100, 
                percentage: 85, 
                grade_letter: 'A', 
                grade_point: 9 
            },
            { 
                student_id: studentIdToUse, 
                subject_id: allSubs[1]._id, 
                semester: 3, 
                academic_year: '2023-24', 
                marks_obtained: 78, 
                total_marks: 100, 
                percentage: 78, 
                grade_letter: 'B+', 
                grade_point: 8 
            }
        ];

        for (const g of grades) {
            const exists = await Grade.findOne({ student_id: studentIdToUse, subject_id: g.subject_id });
            if (!exists) {
                await Grade.create(g);
                console.log(`Created grade for ${allSubs.find(s => s._id.toString() === g.subject_id.toString()).subject_name}`);
            }
        }

        console.log('Dashboard seeding complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDashboardData();
