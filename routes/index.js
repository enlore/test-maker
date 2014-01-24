
/*
 * GET home page.
 */

var Question = require('../models/question')

exports.index = function(req, res){
    Question.find(function (err, questions) {
        if (err) throw err 
        res.render('index', { title: 'Test Maker', questions: questions });
    })
};

exports.new_question = function (req, res) {
    if ('GET' === req.method) {
        res.render('new_question') 
    }

    if ('POST' === req.method) {
        console.log(req.body) 
        question = new Question({
            question: req.body.question,
            answers: [
                req.body.answer_1, 
                req.body.answer_2, 
                req.body.answer_3, 
                req.body.answer_4, 
            ]
        })

        question.save(function (err) {
            if (err) throw err 
            res.redirect('/')
        })
    }
}
