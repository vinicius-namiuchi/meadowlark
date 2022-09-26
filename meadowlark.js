const handlers = require('./lib/handlers')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const weatherMiddlware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')

const app = express()

// configura o view engine Handlebars
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
}))

app.set('view engine', 'handlebars')

const port = process.env.PORT|| 3000

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(weatherMiddlware)

app.get('/', handlers.home)
app.get('/section-test', handlers.sectionTest)

app.use(bodyParser.json())

app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

app.get('/sobre', handlers.sobre)

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) return handlers.vacationPhotoContestProcessError(req, res, err.message)
        console.log('got fields: ', fields)
        console.log('and files: ', files)
        handlers.vacationPhotoContestProcess(req, res, fields, files)
    })
})

// página 404 personalizada
app.use(handlers.notFound)

// página 500 personalizada
app.use(handlers.serverError)

if(require.main === module) {
    app.listen(port, () => {
        console.log(`Express iniciado em http://localhost:${port}. Pressione CTRL + C para finalizar.`)
    })
} else {
    module.exports = app
}