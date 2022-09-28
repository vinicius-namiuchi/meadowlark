const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')
const morgan = require('morgan')
const fs = require('fs')

require('./db')
const credentials = require('./credentials')
const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')
const flashMiddleware = require('./lib/middleware/flash')
const cluster = require('cluster')

const app = express()

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

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

app.use(express.static(__dirname + '/public'))



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession ({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}))

const mailTransport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    auth: {
        user: credentials.sendgrid.user,
        pass: credentials.sendgrid.password,
    },
})

app.use(weatherMiddlware)
app.use(flashMiddleware)

app.use((req, res, next) => {
    if(cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} recebendo requisições`)
    next()
})

app.get('/', handlers.home)

app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.get('/newsletter-archive', handlers.newsletterSignupThankYou)

// vacation photo contest
app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) return handlers.vacationPhotoContestProcessError(req, res, err.message)
        console.log('got fields: ', fields)
        console.log('and files: ', files)
        handlers.vacationPhotoContestProcess(req, res, fields, files)
    })
})
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) return handlers.api.vacationPhotoContestError(req, res, err.message)
        handlers.api.vacationPhotoContest(req, res, fields, files)
    })
})

app.post('/cart/checkout', (req, res, next) => {
    const cart = req.session.cart
    if(!cart) next(new Error('Carrinho não existe.'))
    const name = req.body.name || '', email = req.body.email || ''
    // validação da entrada
    if(!email.match(VALID_EMAIL_REGEX))
        return res.next(new Error('Endereço de e-mail inválido.'))
    // atribui um ID de carrinho aleatório.
    // normalmente usaríamos um ID de banco de dados aqui.
    cart.number = Math.random().toString().replace(/^0\.0*/,'')
    cart.billing = {
        name: name,
        email: email,
    }
    res.render('email/cart-thank-you', { layout: null, cart: cart },
        (err, html) => {
            console.log('E-mail renderizado: ', html)
            if(err) console.log('Erro no template de e-mail')
            mailTransport.sendMail({
                from: '"Meadowlark Travel": contato@paralello.com.br',
                to: cart.billing.email,
                subject: 'Obrigado por reservar sua viagem com Meadowlark Travel',
                html: html,
                text: htmlToFormattedText(html),
            })
            .then(info => {
                console.log('Enviado! ', info)
                res.render('cart-thank-you', { cart: cart })
            })
            .catch(err => {
                console.error('Não foi possível enviar a confirmação: ' + err.message)
            })
        }
    )
})

app.get('*', (req, res) => {
    // simulate shopping cart
    req.session.cart = {
      items: [
        { id: '82RgrqGCAHqCf6rA2vujbT', qty: 1, guests: 2 },
        { id: 'bqBtwqxpB4ohuxCBXRE9tq', qty: 1 },
      ],
    }
    res.render('home')
  })

// página 404 personalizada
app.use(handlers.notFound)

// página 500 personalizada
app.use(handlers.serverError)

function startServer(port) {
    app.listen(port, function() {
        console.log(`Express iniciado em modo ${app.get('env')} em http://localhost:${port}. Pressione as teclas CTRL + C para finalizar.`)
    })
}

if(require.main === module) {
    // a aplicação é executada diretamente. Inicia o servidor do aplicativo
    startServer(process.env.PORT || 3000)
} else {
    // a aplicaçãoé importada como um módulo com "require":
    // exporta a função que cria o servidor
    module.exports = startServer
}