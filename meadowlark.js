const handlers = require('./lib/handlers')
const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

// configura o view engine Handlebars
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

const port = process.env.PORT|| 3000

app.use(express.static(__dirname + '/public'))

app.get('/', handlers.home)

app.get('/sobre', handlers.sobre)

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