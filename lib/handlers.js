exports.api = {}
const fortune = require('./fortune')

exports.home = (req, res) => res.render('home')

exports.newsletterSignup = (req, res) => {
    // aprenderemos o que é CSRF posteriormente..por enquanto
    // forneceremos apenas um valor fictício
    res.render('newsletter-signup', { csrf: 'Token CSRF fica aqui' })
}
exports.newsletterSignupProcess = (req, res) => {
   console.log('Form (da querystring): ' + req.query.form)
    console.log('CSRF (do campo oculto): ' + req.body._csrf)
    console.log('Nome (do campo nome): ' + req.body.nome)
    console.log('E-mail (do campo e-mail): ' + req.body.email)
    res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')

exports.newsletter = (req, res) => {
    // aprenderemos o que é CSRF posteriormente..por enquanto
    // forneceremos apenas um valor fictício
    res.render('newsletter', { csrf: 'Token CSRF fica aqui' })
}
exports.api.newsletterSignup = (req, res) => {
    console.log('CSRF (do campo oculto): ' + req.body._csrf)
    console.log('Nome (do campo nome): ' + req.body.name)
    console.log('E-mail (do campo e-mail): ' + req.body.email)
    res.send({ result: 'success' })
}

exports.vacationPhotoContest = (req, res) => {
    const now = new Date()
    res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() })
  }
  exports.vacationPhotoContestAjax = (req, res) => {
    const now = new Date()
    res.render('contest/vacation-photo-ajax', { year: now.getFullYear(), month: now.getMonth() })
  }
  
  exports.vacationPhotoContestProcess = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.redirect(303, '/contest/vacation-photo-thank-you')
  }
  exports.vacationPhotoContestProcessError = (req, res, fields, files) => {
    res.redirect(303, '/contest/vacation-photo-error')
  }
  exports.vacationPhotoContestProcessThankYou = (req, res) => {
    res.render('contest/vacation-photo-thank-you')
  }
  exports.api.vacationPhotoContest = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
  }
  exports.api.vacationPhotoContestError = (req, res, message) => {
    res.send({ result: 'error', error: message })
  }

exports.sectionTest = (req, res) => res.render('section-test')

exports.sobre = (req, res) => res.render('sobre', { fortune: fortune.getFortune() })

exports.notFound = (req, res) => res.render('404')

// O Express reconhece o manipulador de erro pelos seus
// quatro arqgumentos, logo, temos de desativar a regra
// de variáveis não usadas do ESlint
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */