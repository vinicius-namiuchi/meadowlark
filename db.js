const credentials = require('./credentials')
const mongoose = require('mongoose')
const Vacation = require('./model/vacation')
const VacationInSeasonListener = require('./model/vacationInSeasonListener')
const { connectionString } = credentials.mongo
if(!connectionString) {
    console.error('Faltando string de conexão MongoDB')
    process.exit(1)
}
mongoose.connect(connectionString)
const db = mongoose.connection
db.on('error', err => {
    console.error('Erro MongoDB: ' + err.message)
    process.exit(1)
})
db.once('aberto', () => console.log('Conexão MongoDB estabilizada'))

module.exports = {
    getVacations: async (options = {}) => Vacation.find(options),
    addVacationInSeasonListener: async (email, sku) => {
        if(options.available !== undefined)
            return vacations.filter(({ available }) => available === options.available)
        return vacations
    },
    addVacationInSeasonListener: async (email, sku) => {
        // vamos apenas fingir que fizemos isso..já que essa é
        // uma função async, uma nova promessa será retornada automaticamente
        // e será resolvida como undefined
    },
}

module.exports = {
    getVacations: async (options = {}) => Vacation.find(options),
    addVacationInSeasonListener: async (email, sku) => {
        await VacationInSeasonListener.updateOne(
            { email },
            { $push: { skus: sku } },
            { upsert: true }
        )
    },
}

Vacation.find((err, vacations) => {
    if(err) return console.error(err)
    if(vacations.lenght) return

    // new Vacation({
    //     name: 'Rio Itajaí Dia de Passeio',
    //     slug: 'rio-itajai-dia-passeio',
    //     category: 'Dia de Passeio',
    //     sku: 'HR199',
    //     description: 'Uma longa jornada ao longo do rio itajaí',
    //     location: {
    //         search: 'Rio Itajaí, Itajaí, Santa Catarina',
    //     },
    //     price: 99.99,
    //     tags: ['dia de viagem', 'rio itajai', 'navegando', 'windsurf', 'cervejarias'],
    //     inSeason: true,
    //     maximumGuest: 16,
    //     available: true,
    //     packagesSold: 0,
    // }).save()

    // new Vacation({
    //     name: 'Morro do Careca',
    //     slug: 'morro-careca',
    //     category: 'Passeio ao ar livre',
    //     sku: 'OC39',
    //     description: 'Panorama da cidade de Itajaí',
    //     location: {
    //         search: 'Praia, Itajaí, Santa Catarina',
    //     },
    //     price: 199.99,
    //     tags: ['passeio', 'morro itajai', 'escalada', 'natureza', 'diversão'],
    //     inSeason: false,
    //     maximumGuest: 8,
    //     available: true,
    //     packagesSold: 0,
    // }).save()

    // new Vacation({
    //     name: 'Marejada',
    //     slug: 'marajada',
    //     category: 'Festival',
    //     sku: 'B99',
    //     description: 'Gastronomia e Diversão',
    //     location: {
    //         search: 'Marejada, Itajaí, Santa Catarina',
    //     },
    //     price: 299.99,
    //     tags: ['marejada', 'gastronomia', 'cervejas', 'diversão', 'shows'],
    //     inSeason: true,
    //     requiresWaiver: true,
    //     maximumGuest: 500,
    //     available: true,
    //     packagesSold: 0,
    //     notes: 'Festa com muita comida e bebida e shows ao vivo.'
    // }).save()
})