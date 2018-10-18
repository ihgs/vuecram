const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
})

const sendMail = function (to) {
  let email = {
    from: gmailEmail,
    to: to,
    subject: 'test message',
    text: 'This is a test message from vue.'
  }
  mailTransport.sendMail(email, (err, info) => {
    if (err) {
      return console.log(err)
    }
    return console.log('success')
  })
}

exports.sendMail = sendMail
