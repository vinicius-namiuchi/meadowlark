const credentials = require('./credentials')
const mongoose = require('mongoose')
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
    getVacations: async (options = {}) => {
        // simularemos alguns dados de férias:
        const vacations = [
            {
            name: 'Rio Itajaí Dia de Viagem',
                slug: 'rio-itajai-dia-viagem',
                category: 'Dia de Viagem',
                sku: 'HR199',
                description: 'Uma longa jornada ao longo do rio itajaí',
                location: {
                    //usaremos essa parte para a geolocalização
                    // posteriormente no livro
                    search: 'Rio Itajaí, Itajaí, Santa Catarina',
                },
                price: 99.99,
                tags: ['dia de viagem', 'rio itajai', 'navegando', 'windsurf', 'cervejarias'],
                inSeason: true,
                maximumGuest: 16,
                available: true,
                packagesSold: 0,
            }
        ]
        // se a opção "avaiable" for especificada, somente as
        // férias correspondentes serão retornadas
        if(options.available !== undefined)
            return vacations.filter(({ available }) => available === options.available)
        return vacations
    },
    addVacationInSeasonListner: async (email, sku) => {
        // vamos apenas fingir que fizemos isso..já que essa é
        // uma função async, uma nova promessa será retornada automaticamente
        // e será resolvida como undefined
    },
}