const mongoose = require('mongoose')

const vacationInSeasonListenerSchema = mongoose.Schema({
    email: String,
    skus: [String],
})
const VacationInSeasonListener = mongoose.model('VacactionInSeasonListener',
    vacationInSeasonListenerSchema)

module.exports = VacationInSeasonListener