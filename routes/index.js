
/*
 * GET home page.
 */

var Question  = require('../models/question').Question
  , Test      = require('../models/test').Test

exports.index = function(req, res){
    Test.find(function (err, tests) {
        if (err) throw err
        res.render('index', { title: 'Test Maker', tests: tests });
    })
};

exports.edit_question = function (req, res) {
    Test.findById(req.params.test_id, function (err, test) {
        console.log(test)
        if (err) throw err

        question = test.questions.id(req.params.question_id)
        console.log(question)
        if ('GET' === req.method) {
            res.render('edit_question', {test: test, question: question})
        }

        if ('POST' === req.method) {
            if (err) throw err
            question.question = req.body.question
            question.answers = [
                req.body.answer_1,
                req.body.answer_2,
                req.body.answer_3,
                req.body.answer_4
            ]

            Test.update({_id: req.params.test_id, 'questions._id': req.params.question_id},
                {$set: {
                        'questions.$.question': question.question,
                        'questions.$.answers': question.answers
                }},
                function (err, result) {
                    if (err) throw err
                    console.log('~~~~~~~~>')
                    console.log(result)
                    res.redirect('/')
                }
            )
        }

    })
}

exports.new_test = function (req, res) {
    if ('GET' === req.method) {
        res.render('new_test')
    }

    if ('POST' === req.method) {
        console.log(req.body)
        test = new Test({title: req.body.title})

        test.save(function (err) {
            if (err) throw err
            res.redirect('/')
        })
    }
}

exports.new_question = function (req, res) {
    Test.findById(req.params.id, function (err, test) {
        if ('GET' === req.method) {
            res.render('new_question', {test: test})
        }

        if ('POST' === req.method) {
            console.log(req.body)
            question = new Question({
                number: test.questions.length + 1,
                question: req.body.question,
                answers: [
                    req.body.answer_1,
                    req.body.answer_2,
                    req.body.answer_3,
                    req.body.answer_4,
                ]
            })

            test.questions.push(question)

            test.save(function (err) {
                if (err) throw err
                res.redirect('/')
            })
        }
    })
}
