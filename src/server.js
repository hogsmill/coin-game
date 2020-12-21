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

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

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

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'loadWorkshop':
        dbStore.loadWorkshop(err, client, db, io, data, debugOn)
        break
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break
      case 'getWorkshopResults':
        dbStore.getWorkshopResults(err, client, db, io, data, debugOn)
        break
      case 'addPlayer':
        dbStore.addPlayer(err, client, db, io, data, debugOn)
        break
      case 'changePlayerName':
        dbStore.changePlayerName(err, client, db, io, data, debugOn)
        break
      case 'deletePlayer':
        dbStore.deletePlayer(err, client, db, io, data, debugOn)
        break
      case 'updateGameRole':
        dbStore.updateGameRole(err, client, db, io, data, debugOn)
        break
      case 'startRound':
        dbStore.startRound(err, client, db, io, data, debugOn)
        break
      case 'playCoin':
        dbStore.playCoin(err, client, db, io, data, debugOn)
        break

      // Facilitator
      case 'loadWorkshops':
        dbStore.loadWorkshops(err, client, db, io, data, debugOn)
        break
      case 'loadEditingWorkshop':
        dbStore.loadEditingWorkshop(err, client, db, io, data, debugOn)
        break
      case 'loadEditingGame':
        dbStore.loadEditingGame(err, client, db, io, data, debugOn)
        break
      case 'addGame':
        dbStore.addGame(err, client, db, io, data, debugOn)
        break
      case 'updateDenomination':
        dbStore.updateCurrency(err, client, db, io, 'denomination', data, debugOn)
        break
      case 'updateCurrency':
        dbStore.updateCurrency(err, client, db, io, 'currency', data, debugOn)
        break
      case 'setRoleInclude':
        dbStore.updateRoles(err, client, db, io, 'setRoleInclude', data, debugOn)
        break
      case 'moveRoleUp':
        dbStore.updateRoles(err, client, db, io, 'moveRoleUp', data, debugOn)
        break
      case 'moveRoleDown':
        dbStore.updateRoles(err, client, db, io, 'moveRoleDown', data, debugOn)
        break
      case 'updateRoleName':
        dbStore.updateRoles(err, client, db, io, 'updateRoleName', data, debugOn)
        break
      case 'deleteRole':
        dbStore.updateRoles(err, client, db, io, 'deleteRole', data, debugOn)
        break
      case 'addNewRole':
        dbStore.updateRoles(err, client, db, io, 'addNewRole', data, debugOn)
        break
      case 'updateInterval':
        data.value = parseInt(data.value)
        dbStore.updateConfig(err, client, db, io, data, 'interval', debugOn)
        break
      case 'updateDemoTimeLimit':
        data.value = parseInt(data.value)
        dbStore.updateConfig(err, client, db, io, data, 'timeLimit.demo', debugOn)
        break
      case 'updateClickTimeLimit':
        data.value = parseInt(data.value)
        dbStore.updateConfig(err, client, db, io, data, 'timeLimit.click', debugOn)
        break
      case 'updateDemoValueTimeLimit':
        data.value = parseInt(data.value)
        dbStore.updateConfig(err, client, db, io, data, 'valueTimeLimit.demo', debugOn)
        break
      case 'updateClickValueTimeLimit':
        data.value = parseInt(data.value)
        dbStore.updateConfig(err, client, db, io, data, 'valueTimeLimit.click', debugOn)
        break
      case 'updateClickOnCoins':
        dbStore.updateConfig(err, client, db, io, data, 'clickOnCoins', debugOn)
        break
      case 'updateNamedRolesClick':
        dbStore.updateConfig(err, client, db, io, data, 'namedRolesClick', debugOn)
        break
      default:
        console.log('Unknown function ', fun)
    }
  })
}

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

  socket.on('loadWorkshop', (data) => { doDb('loadWorkshop', data) })

  socket.on('loadGame', (data) => { doDb('loadGame', data) })

  socket.on('getWorkshopResults', (data) => { doDb('getWorkshopResults', data) })

  socket.on('restartGame', (data) => { doDb('restartGame', data) })

  socket.on('addPlayer', (data) => { doDb('addPlayer', data) })

  socket.on('changePlayerName', (data) => { doDb('changePlayerName', data) })

  socket.on('deletePlayer', (data) => { doDb('deletePlayer', data) })

  socket.on('updateGameRole', (data) => { doDb('updateGameRole', data) })

  socket.on('startRound', (data) => { doDb('startRound', data) })

  socket.on('playCoin', (data) => { doDb('playCoin', data) })

  socket.on('status', (data) => { emit('status', data) })

  // Facilitator

  socket.on('loadWorkshops', (data) => { doDb('loadWorkshops', data) })

  socket.on('loadEditingWorkshop', (data) => { doDb('loadEditingWorkshop', data) })

  socket.on('loadEditingGame', (data) => { doDb('loadEditingGame', data) })

  socket.on('addGame', (data) => { doDb('addGame', data) })

  socket.on('updateCurrency', (data) => { doDb('updateCurrency', data) })

  socket.on('updateDenomination', (data) => { doDb('updateDenomination', data) })

  socket.on('setRoleInclude', (data) => { doDb('setRoleInclude', data) })

  socket.on('moveRoleUp', (data) => { doDb('moveRoleUp', data) })

  socket.on('moveRoleDown', (data) => { doDb('moveRoleDown', data) })

  socket.on('updateRoleName', (data) => { doDb('updateRoleName', data) })

  socket.on('deleteRole', (data) => { doDb('deleteRole', data) })

  socket.on('addNewRole', (data) => { doDb('addNewRole', data) })

  socket.on('updateInterval', (data) => { doDb('updateInterval', data) })

  socket.on('updateDemoTimeLimit', (data) => { doDb('updateDemoTimeLimit', data) })

  socket.on('updateClickTimeLimit', (data) => { doDb('updateClickTimeLimit', data) })

  socket.on('updateDemoValueTimeLimit', (data) => { doDb('updateDemoValueTimeLimit', data) })

  socket.on('updateClickValueTimeLimit', (data) => { doDb('updateClickValueTimeLimit', data) })

  socket.on('updateClickOnCoins', (data) => { doDb('updateClickOnCoins', data) })

  socket.on('updateNamedRolesClick', (data) => { doDb('updateNamedRolesClick', data) })

  // Learnings

  socket.on('showLearnings', (data) => { emit('showLearnings', data) })

  socket.on('hideLearnings', (data) => { emit('hideLearnings', data) })

  socket.on('incrementLearnings', (data) => { emit('incrementLearnings', data) })

  // ---------------------------------------------------

  //socket.on("go", (data) => { emit("go", data) })

  socket.on('updateMyName', (data) => { emit('updateMyName', data) })

  //socket.on("updateGameState", (data) => { emit("updateGameState", data) })

})

const port = process.argv[2] || 3000

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
