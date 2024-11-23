const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to ensure user is authenticated
const Question = require('../models/Question');
const User = require('../models/User');
const Quiz = require('../models/Quiz'); 
// const { getQuestionsByGrade } = require('../controllers/questionController');
// const { submitQuiz } = require('../controllers/quizController');


router.get('/generate', authMiddleware, async (req, res) => {
    try {
        const { grade } = req.user;

        // Define topics based on grade
        const topics = grade <= 8 ? ['algebra', 'geometry'] : ['calculus', 'trigonometry'];

        // Fetch 20 random questions for the selected grade and topics
        const questions = await Question.aggregate([
            { $match: { topic: { $in: topics } } },
            { $sample: { size: 20 } }, // Randomly select 20 questions
        ]);

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz.' });
    }
});


// Submit quiz and evaluate results
// routes/quizRoutes.js (Submit and Evaluate Quiz)

router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { responses } = req.body; // { questionId: answer, ... }
        let score = 0;
        const results = [];

        for (const [questionId, userAnswer] of Object.entries(responses)) {
            const question = await Question.findById(questionId);
            const isCorrect = question.answer === userAnswer;

            // Add question results to response
            results.push({
                question: question.question,
                userAnswer,
                isCorrect,
                correctAnswer: question.answer,
                topic: question.topic,
            });

            // Increment score if correct
            if (isCorrect) {
                score += question.weight;
            }
        }

        // Respond with score, results, and improvement suggestions
        res.status(200).json({
            score,
            results,
        });
    } catch (error) {
        console.error('Error evaluating quiz:', error);
        res.status(500).json({ error: 'Failed to evaluate quiz.' });
    }
});


// Adaptive Quiz Logic: Fetch next set of questions based on performance
// routes/quizRoutes.js (Adaptive Logic Endpoint)

router.post('/adaptive', authMiddleware, async (req, res) => {
    try {
        const { performance, lastQuestionId } = req.body; // { correct: boolean, lastTopic: string }
        const { correct, lastTopic, difficulty } = performance;

        // Determine the difficulty of the next question
        let nextDifficulty = 'medium';
        if (correct) {
            nextDifficulty = difficulty === 'easy' ? 'medium' : 'hard';
        } else {
            nextDifficulty = difficulty === 'hard' ? 'medium' : 'easy';
        }

        // Fetch next question based on lastTopic and calculated difficulty
        const nextQuestions = await Question.find({
            topic: lastTopic,
            difficulty: nextDifficulty,
        }).limit(1); // Fetching 1 question at a time

        res.status(200).json(nextQuestions);
    } catch (error) {
        console.error('Error with adaptive logic:', error);
        res.status(500).json({ error: 'Failed to fetch adaptive questions.' });
    }
});


module.exports = router;
