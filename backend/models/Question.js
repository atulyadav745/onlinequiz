const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    topic: { type: String, required: true },    // e.g., 'algebra', 'geometry', 'calculus'
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    grade: { type: Number, required: true },    // e.g., grade 8, grade 9, etc.
    weight: { type: Number, default: 1 }        // For scoring
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
