const mongoose = require('mongoose')

const vacationSchema = mongoose.Schema({
    name: String,
    slug: String,
    categaory: String,
    sku: String,
    description: String,
    location: {
        search: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    price: Number,
    tags: [String],
    inSeason: Boolean,
    available: Boolean,
    requiresWaiver: Boolean,
    maximumGuests: Number,
    notes: String,
    packageSold: Number,
})

const Vacation = mongoose.model('Vacation', vacationSchema)
module.exports = Vacation