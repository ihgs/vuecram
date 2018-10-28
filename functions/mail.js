const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const util = require('util')

const sendMail = function (to, name, time) {
  if (!functions.config().gmail) {
    console.log('Not set gmail settings')
    return
  }
  const gmailEmail = functions.config().gmail.email
  const gmailPassword = functions.config().gmail.password
  const subject = functions.config().mail.subject
  const body = util.format(functions.config().mail.body, name, time)
  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    }
  })
  let email = {
    from: gmailEmail,
    to: to,
    subject: subject,
    text: body
  }
  mailTransport.sendMail(email, (err, info) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Send mail success')
  })
}

exports.sendMail = sendMail
