var mongoose    = require('mongoose')
  , questionSchema = new mongoose.Schema({
        number: Number,
        question: String,
        answers: Array
    })

module.exports = mongoose.model('Question', questionSchema)
