const env = process.env.NODE_ENV || 'developement'
const credentials = require(`./.credentials.${env}`)
module.exports = { credentials }