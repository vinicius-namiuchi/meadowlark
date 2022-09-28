const nodemailer = require('nodemailer')

const credentials = require('./credentials')

const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  },
})

async function go() {
  try {
      const result = await mailTransport.sendMail({
          from: '"Meadowlark Travel" <contato@paralello.com.br>',
          to: 'vinicius.namiuchi@gmail.com',
          subject: 'Seu passeio Meadowlark Travel',
          text: 'Obrigado por hospedar com Meadowlark Travel. Aguardamos sua próxima visita!',
      })
      console.log('E-mail enviado com sucesso: ', result)
  } catch(err) {
      console.log('Não foi possível enviar o e-mail', + err.message)
  }
}

go()