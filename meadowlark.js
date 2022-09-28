const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')
const morgan = require('morgan')
const fs = require('fs')

const credentials = require('./credentials')
const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')
const flashMiddleware = require('./lib/middleware/flash')

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

switch(app.get('env')) {
    case 'development':
        app.use(morgan('dev'))
        break
    case 'production':
        const stream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
        app.use(morgan('combined', { stream }))
        break
}

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

app.get('/', handlers.home)

app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.get('/newsletter-archive', handlers.newsletterSignupThankYou)

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

const port = process.env.PORT|| 3000

if(require.main === module) {
    app.listen(port, () => {
        console.log(`Express iniciado em modo ${app.get('env')} no endereço http://localhost:${port}. Pressione CTRL + C para finalizar.`)
    })
} else {
    module.exports = app
}