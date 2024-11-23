// seedQuestions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../backend/models/Question');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:5000/quiz', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error connecting to database', err));

const seedQuestions = async () => {
    const questions = [
        {
            question: "What is the solution to the equation 2x + 5 = 15?",
            options: ["x = 5", "x = 7", "x = 10", "x = 3"],
            answer: "x = 5",
            topic: "algebra",
            difficulty: "medium",
            grade: 8
        },
        {
            question: "What is the area of a triangle with a base of 5 cm and a height of 10 cm?",
            options: ["50 cm²", "25 cm²", "100 cm²", "10 cm²"],
            answer: "25 cm²",
            topic: "geometry",
            difficulty: "easy",
            grade: 8
        },
        {
            question: "What is the derivative of x² + 3x?",
            options: ["2x + 3", "x + 3", "2x + 1", "3x + 2"],
            answer: "2x + 3",
            topic: "calculus",
            difficulty: "medium",
            grade: 9
        },
        {
            question: "What is the sine of a 45-degree angle?",
            options: ["0.7071", "1", "0.5", "0.866"],
            answer: "0.7071",
            topic: "trigonometry",
            difficulty: "hard",
            grade: 10
        },
        // Add more questions for different grades and topics
    ];

    try {
        // Insert the questions into the database
        await Question.insertMany(questions);
        console.log('Questions seeded successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding questions:', err);
        mongoose.connection.close();
    }
};

seedQuestions();
