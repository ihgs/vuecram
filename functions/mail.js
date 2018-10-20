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

const sendMail = function (to, subject, body) {
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
    return
  })
}

exports.sendMail = sendMail
