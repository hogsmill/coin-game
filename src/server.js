const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

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

    socket.on('loadWorkshop', (data) => { dbStore.loadWorkshop(db, io, data, debugOn) })

    socket.on('loadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('getWorkshopResults', (data) => { dbStore.getWorkshopResults(db, io, data, debugOn) })

    socket.on('restartGame', (data) => { dbStore.restartGame(db, io, data, debugOn)})

    socket.on('updateGameRole', (data) => { dbStore.updateGameRole(db, io, data, debugOn) })

    socket.on('startRound', (data) => { dbStore.startRound(db, io, data, debugOn) })

    socket.on('playCoin', (data) => { dbStore.playCoin(db, io, data, debugOn) })

    socket.on('status', (data) => { emit('status', data) })

    // Facilitator

    socket.on('checkSystemWorkshops', () => {  dbStore.checkSystemWorkshops(db, io, debugOn) })

    socket.on('loadWorkshops', (data) => { dbStore.loadWorkshops(db, io, debugOn) })

    socket.on('loadEditingWorkshop', (data) => { dbStore.loadEditingWorkshop(db, io, data, debugOn) })

    socket.on('addWorkshop', (data) => { dbStore.addWorkshop(db, io, data, debugOn) })

    socket.on('deleteWorkshop', (data) => { dbStore.deleteWorkshop(db, io, data, debugOn) })

    socket.on('loadEditingGame', (data) => { dbStore.loadEditingGame(db, io, data, debugOn) })

    socket.on('addGame', (data) => { dbStore.addGame(db, io, data, debugOn) })

    socket.on('deleteGame', (data) => { dbStore.deleteGame(db, io, data, debugOn) })

    socket.on('addPlayer', (data) => { dbStore.addPlayer(db, io, data, debugOn) })

    socket.on('changePlayerName', (data) => { dbStore.changePlayerName(db, io, data, debugOn) })

    socket.on('deletePlayer', (data) => { dbStore.deletePlayer(db, io, data, debugOn) })

    socket.on('updateCurrency', (data) => { dbStore.updateCurrency(db, io, 'currency', data, debugOn) })

    socket.on('updateDenomination', (data) => { dbStore.updateCurrency(db, io, 'denomination', data, debugOn) })

    socket.on('setRoleInclude', (data) => { dbStore.updateRoles(db, io, 'setRoleInclude', data, debugOn) })

    socket.on('moveRoleUp', (data) => { dbStore.updateRoles(db, io, 'moveRoleUp', data, debugOn) })

    socket.on('moveRoleDown', (data) => { dbStore.updateRoles(db, io, 'moveRoleDown', data, debugOn) })

    socket.on('updateRoleName', (data) => { dbStore.updateRoles(db, io, 'updateRoleName', data, debugOn) })

    socket.on('deleteRole', (data) => { dbStore.updateRoles(db, io, 'deleteRole', data, debugOn) })

    socket.on('addNewRole', (data) => { dbStore.updateRoles(db, io, 'addNewRole', data, debugOn) })

    socket.on('updateInterval', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'interval', debugOn)
    })

    socket.on('updateDemoTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'timeLimit.demo', debugOn)
    })

    socket.on('updateClickTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'timeLimit.click', debugOn)
    })

    socket.on('updateDemoValueTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'valueTimeLimit.demo', debugOn)
    })

    socket.on('updateClickValueTimeLimit', (data) => {
      data.value = parseInt(data.value)
      dbStore.updateConfig(db, io, data, 'valueTimeLimit.click', debugOn)
    })

    socket.on('updateClickOnCoins', (data) => { dbStore.updateConfig(db, io, data, 'clickOnCoins', debugOn) })

    socket.on('updateNamedRolesClick', (data) => { dbStore.updateConfig(db, io, data, 'namedRolesClick', debugOn) })

    // Learnings

    socket.on('hideLearnings', (data) => { emit('hideLearnings', data) })

    socket.on('incrementLearnings', (data) => { emit('incrementLearnings', data) })

    // ---------------------------------------------------

    //socket.on("go", (data) => { emit("go", data) })

    socket.on('updateMyName', (data) => { emit('updateMyName', data) })

    //socket.on("updateGameState", (data) => { emit("updateGameState", data) })
  })
})

const port = process.argv[2] || 3000
httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
