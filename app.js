var express     = require('express')
    , routes    = require('./routes')
    , http      = require('http')
    , path      = require('path')
    , mongoose  = require('mongoose')

var app = express()

app.set('port', process.env.PORT || 3000)
app.set('env', process.env.NODE_ENV || 'development')
app.set('secret', process.env.SECRET || 'WHAT IS A MAN')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.compress())
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.cookieParser(app.get('secret')))
app.use(express.bodyParser())
app.use(express.session())
app.use(app.router)

var less_opts = {
   src              : path.join(__dirname, 'static'),
   compress         : false,
   debug            : true,
   paths            : [path.join(__dirname, 'static')],
   once             : false,
   dest             : path.join(__dirname, 'static'),
   dumpLineNumbers  : 'comments',
   sourceMap        : true,
}

function getMongoURL() {
    var mongoCreds = {}

    if (process.env.VCAP_SERVICES) {
        console.log('~~~~~~~~> %s', process.env.VCAP_SERVICES)
        var env = JSON.parse(process.env.VCAP_SERVICES)
        mongoCreds  = env['mongodb2-2.4.8'][0]['credentials']
        console.log('~~~~~~~~> %s', mongoCreds)
    } else {
        mongoCreds = {
            hostname: 'localhost', 
            port: 27017,
            username: '',
            password: '',
            name: '',
            db: 'test-maker'
        }
    }

    // mongoCreads has a uname and pass
    if (mongoCreds.username && mongoCreds.password) {
        return 'mongodb://' + mongoCreds.username + ':' + mongoCreds.password 
        + '@' + mongoCreds.hostname + ':' + mongoCreds.port + '/' + mongoCreds.db
    } else {
        return 'mongodb://' + mongoCreds.hostname + ':' + mongoCreds.port + '/' + mongoCreds.db
    } 
}

console.log(getMongoURL())
mongoose.connect(getMongoURL())

// dev config
if ('development' == app.get('env')) {
  app.use(express.errorHandler())
  app.locals.pretty = true
}

// pro config
if ('production' == app.get('env')) {
    less_opts.debug             = false
    less_opts.compress          = true
    less_opts.once              = true
    less_opts.dumpLineNumbers   = 0
    less_opts.sourcemap         = false
}

app.use(require('less-middleware')(less_opts))
app.use(express.static(path.join(__dirname, 'static')))

app.get('/', routes.index)
app.get('/test/:id/questions/new', routes.new_question)
app.post('/test/:id/questions/new', routes.new_question)

app.get('/test/:test_id/questions/:question_id/edit', routes.edit_question)
app.post('/test/:test_id/questions/:question_id/edit', routes.edit_question)

app.get('/test/new', routes.new_test)
app.post('/test/new', routes.new_test)


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})
