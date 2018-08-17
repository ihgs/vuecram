const functions = require('firebase-functions')
const admin = require('firebase-admin')
const moment = require('moment')
const express = require('express')

admin.initializeApp(functions.config().firebase)

const WebError = function (statusCode, message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.statusCode = statusCode
  this.message = message
}

const isValidToken = function (token) {
  const db = admin.database()
  return db.ref('settings/tokens').orderByChild('token').equalTo(token).once('value')
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
  isValidToken(request.get('ACCESS_TOKEN')).then(function(valid) {
    try{
      if (valid.numChildren() !== 1) {
        throw new WebError(403, 'Invalid token')
      }
      const cardId = request.body.card_id
      const deviceName = request.body.device_name

      const db = admin.database()
      db.ref('students').orderByChild('card/cardId').equalTo(cardId).once('value', function (snapshot) {
        if (snapshot.numChildren() === 1) {
          snapshot.forEach(function (data) {
            const targetMonth = moment().format('YYYY/MM')
            const userId = data.key
            const stampsRef = db.ref('stamps/' + targetMonth + '/' + userId)
            stampsRef.push({
              timestamp: admin.database.ServerValue.TIMESTAMP,
              device_name: deviceName
            })
              .then(ss => {
                response.status(201).send(ss)
              })
              .catch(error => {
                throw new WebError(500, error)
              })
          })
        } else if (snapshot.numChildren() === 0) {
          throw new WebError(404, 'No data')
        } else {
          throw new WebError(500, 'duplicate card id')
        }
      })
    } catch (e) {
      if (e instanceof WebError) {
        response.status(e.statusCode).send({error: e.message})
      } else {
        response.status(500).send(e)
      }
    }
  })
}

const app = express()
app.post('/stamp', stamp)
exports.api = functions.https.onRequest(app)
