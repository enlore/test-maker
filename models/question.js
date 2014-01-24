var mongoose    = require('mongoose')
  , questionSchema = new mongoose.Schema({
        number: Number,
        question: String,
        answers: Array
    })

exports.questionSchema = questionSchema
exports.Question = mongoose.model('Question', questionSchema)
