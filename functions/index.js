const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Tokyo')
const mail = require('./mail')

admin.initializeApp(functions.config().firebase)
const firestore = admin.firestore()

const isValidToken = function (token) {
  return firestore.collection('settings.token').doc(token).get()
}

/**
 * 打刻を実施
 * header
 * -  ACCESS_TOKEN: TOKEN
 * request body
 * {
 *  "card_id": "xxxx",
 *  "device_name": "yyyy"
 * }
 */
const stamp = function (request, response) {
  isValidToken(request.get('ACCESS_TOKEN')).then(function (valid) {
    if (!valid.exists) {
      response.status(403).send(
        {
          status: 'error',
          message: 'This reader is not registered'
        }
      )
      console.log('This reader is not registered')
      return
    }
    const cardId = request.body.card_id
    const deviceName = request.body.device_name
    firestore.collection('students').where('card.cardId', '==', cardId).get()
      .then(snapshot => {
        if (snapshot._size === 0) {
          response.status(404).send(
            {
              status: 'error',
              message: `This card(${cardId}) is not registered.`
            }
          )
          console.log(`This card(${cardId}) is not registered.`)
          return
        }
        snapshot.forEach(function (data) {
          const userId = data.id
          const student = data.data()
          const name = `${student.base.familyName} ${student.base.firstName}`
          const timestamp = new Date()
          const stamp = {
            'device_name': deviceName,
            'timestamp': timestamp,
            'student_id': userId
          }
          firestore.collection('stamps').add(stamp)
            .then(ss => {
              const tomail = student.card.mail
              if (tomail) {
                const timestr = moment(timestamp).format('HH:mm')
                mail.sendMail(tomail, name, timestr)
              }
              response.status(201).send(
                {
                  status: 'success',
                  name: name
                }
              )
            })
            .catch(onRejected => {
              console.log(onRejected)
              response.status(500).send(
                {
                  status: 'error'
                }
              )
            })
        })
      })
      .catch(onRejected => {
        console.log(onRejected)
        response.status(500).send(
          {
            status: 'error'
          }
        )
      })
  })
    .catch(function (onRejected) {
      console.log(onRejected)
      response.status(500).send(
        {
          status: 'error'
        }
      )
    })
}

const app = express()
app.post('/stamp', stamp)
exports.api = functions.https.onRequest(app)
