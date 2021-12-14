const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const port = prod ? process.env.VUE_APP_PORT : 3000
const logFile = prod ? process.argv[4] : 'server.log'
const gameCollection = prod ? process.env.VUE_APP_GAME_COLLECTION : 'coinGame'
const workshopCollection = prod ? process.env.VUE_APP_WORKSHOP_COLLECTION : 'coinGameWorkshops'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 500

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

  db.createCollection(gameCollection, function(error, collection) {})
  db.createCollection(workshopCollection, function(error, collection) {})

  db.gameCollection = db.collection(gameCollection)
  db.workshopCollection = db.collection(workshopCollection)

  io.on('connection', (socket) => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] ? connections[connection] + 1 : 1
    if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      const connection = socket.handshake.headers.host
      connections[connection] = connections[connection] - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    })

    socket.on('sendLoadWorkshop', (data) => { dbStore.loadWorkshop(db, io, data, debugOn) })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendGetWorkshopResults', (data) => { dbStore.getWorkshopResults(db, io, data, debugOn) })

    socket.on('sendClearUsers', (data) => { dbStore.clearUsers(db, io, data, debugOn)})
    
    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn)})

    socket.on('sendUpdateGameRole', (data) => { dbStore.updateGameRole(db, io, data, debugOn) })

    socket.on('sendStartRound', (data) => { dbStore.startRound(db, io, data, debugOn) })

    socket.on('sendPlayCoin', (data) => { dbStore.playCoin(db, io, data, debugOn) })

    socket.on('sendStatus', (data) => { emit('status', data) })

    // Facilitator

    socket.on('sendCheckSystemWorkshops', () => {  dbStore.checkSystemWorkshops(db, io, debugOn) })

    socket.on('sendLoadWorkshops', () => { dbStore.loadWorkshops(db, io, debugOn) })

    socket.on('sendLoadEditingWorkshop', (data) => { dbStore.loadEditingWorkshop(db, io, data, debugOn) })

    socket.on('sendAddWorkshop', (data) => { dbStore.addWorkshop(db, io, data, debugOn) })

    socket.on('sendDeleteWorkshop', (data) => { dbStore.deleteWorkshop(db, io, data, debugOn) })

    socket.on('sendLoadEditingGame', (data) => { dbStore.loadEditingGame(db, io, data, debugOn) })

    socket.on('sendAddGame', (data) => { dbStore.addGame(db, io, data, debugOn) })

    socket.on('sendDeleteGame', (data) => { dbStore.deleteGame(db, io, data, debugOn) })

    socket.on('sendAddPlayer', (data) => { dbStore.addPlayer(db, io, data, debugOn) })

    socket.on('sendChangePlayerName', (data) => { dbStore.changePlayerName(db, io, data, debugOn) })

    socket.on('sendDeletePlayer', (data) => { dbStore.deletePlayer(db, io, data, debugOn) })

    socket.on('sendUpdateCurrency', (data) => { dbStore.updateCurrency(db, io, 'currency', data, debugOn) })

    socket.on('sendResetDefaultDenominations', (data) => { dbStore.resetDefaultDenominations(db, io, data, debugOn) })

    socket.on('sendUpdateDenomination', (data) => { dbStore.updateCurrency(db, io, 'denomination', data, debugOn) })

    socket.on('sendSetRoleInclude', (data) => { dbStore.updateRoles(db, io, 'setRoleInclude', data, debugOn) })

    socket.on('sendMoveRoleUp', (data) => { dbStore.updateRoles(db, io, 'moveRoleUp', data, debugOn) })

    socket.on('sendMoveRoleDown', (data) => { dbStore.updateRoles(db, io, 'moveRoleDown', data, debugOn) })

    socket.on('sendUpdateRoleName', (data) => { dbStore.updateRoles(db, io, 'updateRoleName', data, debugOn) })

    socket.on('sendDeleteRole', (data) => { dbStore.updateRoles(db, io, 'deleteRole', data, debugOn) })

    socket.on('sendAddNewRole', (data) => { dbStore.updateRoles(db, io, 'addNewRole', data, debugOn) })

    socket.on('sendUpdateInterval', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'interval', debugOn)
    })

    socket.on('sendUpdateDemoTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'timeLimit.demo', debugOn)
    })

    socket.on('sendUpdateClickTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'timeLimit.click', debugOn)
    })

    socket.on('sendUpdateDemoValueTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'valueTimeLimit.demo', debugOn)
    })

    socket.on('sendUpdateClickValueTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'valueTimeLimit.click', debugOn)
    })

    socket.on('sendUpdateClickOnCoins', (data) => { dbStore.updateConfig(db, io, data, 'clickOnCoins', debugOn) })

    socket.on('sendUpdateNamedRolesClick', (data) => { dbStore.updateConfig(db, io, data, 'namedRolesClick', debugOn) })

    socket.on('sendOnlyAdminCanControl', (data) => { dbStore.updateConfig(db, io, data, 'onlyAdminCanControl', debugOn) })

    // Learnings

    socket.on('sendHideLearnings', (data) => { emit('hideLearnings', data) })

    socket.on('sendIncrementLearnings', (data) => { emit('incrementLearnings', data) })

    // ---------------------------------------------------

    //socket.on("go", (data) => { emit("go", data) })

    socket.on('updateMyName', (data) => { emit('updateMyName', data) })

    //socket.on("updateGameState", (data) => { emit("updateGameState", data) })
  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
