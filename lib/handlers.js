exports.api = {}
const fortune = require('./fortune')

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

  class NewsletterSignup {
    constructor({ name, email }) {
      this.name = name
      this.email = email
    }
    async save() {
    }
  }

exports.home = (req, res) => res.render('home')

exports.newsletterSignup = (req, res) => {
    // aprenderemos o que é CSRF posteriormente..por enquanto
    // forneceremos apenas um valor fictício
    res.render('newsletter-signup', { csrf: 'Token CSRF fica aqui' })
}
exports.newsletterSignupProcess = (req, res) => {
  const name = req.body.name || '', email = req.body.email || ''
  // Validação
  if(!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Erro na validação!',
      message: 'E-mail informado não á válido.',
    }
    return res.redirect(303, '/newsletter-signup')
  }

  new NewsletterSignup({ name, email }).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Muito obrigado!',
        message: 'Você se inscreveu na newsletter.',
      }
      return res.redirect(303, '/newsletter-archive')
    })
    .catch(err => {
      req.session.flash = {
        type: 'danger',
        intro: 'Erro no banco de dados!',
        message: 'Ocorreu um erro de banco de dados; por favor, tente novamente mais tarde.',
      }
      return res.redirect(303, '/newsletter-archive')
    })
}

exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')
exports.newsletterArchive = (req, res) => res.render('newsletter-archive')

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

const pathUtils = require('path')
const fs = require('fs')

// cria diretório para armazenar fotos de férias (se ele ainda não existir)
const dataDir = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos')
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if(!fs.existsSync(vacationPhotosDir)) fs.mkdirSync(vacationPhotosDir)

function saveContestEntry(contestName, email, year, month, photoPath) {
  //A ser concluído para depois
}

// precisaremos dessas versões de funções do fs beseadas
// em promessas posteriores
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)

exports.api.vacationPhotoContest = async (req, res, fields, files) => {
  const photo = files.photo[0]
  const dir = vacationPhotosDir + '/' + Date.now()
  const path = dir + '/' + photo.originalFilename
  await mkdir(dir)
  await rename(photo.path, path)
  saveContestEntry('vacation-photo', fields.email,
  req.params.year, req.params.month, path)
  res.send({ result: 'success' })
}

exports.api.vacationPhotoContestError = (req, res, message) => {
  res.send({ result: 'error', error: message })
}

exports.vacationPhotoContestProcessThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you')
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