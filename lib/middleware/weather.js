const getWeatherData = () => Promise.resolve([
    {
        location: {
            name: 'Itajaí',
            coorinates: { lat: 45.5154586, lng: -122.6793461 },
        },
        foreacastUrl: 'https://api.weather.gov/gridpoints/PQR/112,103/forecast',
        iconUrl: 'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
        weather: 'Chances de chuvas e relâmpagos',
        temp: '22 C',
    },
    {
        location: {
            name: 'Balneário Camboriú',
            coorinates: { lat: 44.0581728, lng: -121.3153096 },
        },
        foreacastUrl: 'https://api.weather.gov/gridpoints/PDT/34,40/forecast',
        iconUrl: 'https://api.weather.gov/icons/land/day/tsra,50?size=medium',
        weather: 'Chuvas com relâmpagos',
        temp: '21 C',
    },
    {
        location: {
            name: 'Navegantes',
            coorinates: { lat: 44.0581728, lng: -123.9351354 },
        },
        foreacastUrl: 'https://api.weather.gov/gridpoints/PQR/73,120/forecast',
        iconUrl: 'https://api.weather.gov/icons/land/day/tsra,90?size=medium',
        weather: 'Chuvas com relâmpagos',
        temp: '20 C',
    },
])

const weatherMiddleware = async(req, res, next) => {
    if(!res.locals.partials) res.locals.partials = {}
    res.locals.partials.weatherContext = await getWeatherData()
    next()
}

module.exports = weatherMiddleware