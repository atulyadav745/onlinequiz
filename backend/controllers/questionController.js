// controllers/questionController.js
const Question = require('../models/Question');

// Fetch questions by grade
const getQuestionsByGrade = async (req, res) => {
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
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

module.exports = {
    getQuestionsByGrade,
};
