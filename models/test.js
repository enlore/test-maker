var mongoose = require('mongoose')
  , questionSchema = require('./question').questionSchema

var testSchema = mongoose.Schema({
    title: String,
    questions: [questionSchema]
})

exports.Test = mongoose.model('Test', testSchema)
