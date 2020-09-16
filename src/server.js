const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const os = require('os')

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const prod = os.hostname() == 'agilesimulations' ? true : false
const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = false //!prod

const connections = {}
const maxConnections = 20

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break
        case 'addPlayer':
          dbStore.addPlayer(err, client, db, io, data, debugOn)
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

      // Config
      case 'updateDenominations':
        dbStore.updateConfig(err, client, db, io, data, 'denominations', debugOn)
        break
      case 'updateCurrency':
        dbStore.updateCurrency(err, client, db, io, data, debugOn)
        break
      case 'updateRoles':
        dbStore.updateRoles(err, client, db, io, data, debugOn)
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

  socket.on('loadGame', (data) => { doDb('loadGame', data) })

  socket.on('restartGame', (data) => { doDb('restartGame', data) })

  socket.on('addPlayer', (data) => { doDb('addPlayer', data) })

  socket.on('updateGameRole', (data) => { doDb('updateGameRole', data) })

  socket.on('startRound', (data) => { doDb('startRound', data) })

  socket.on('playCoin', (data) => { doDb('playCoin', data) })

  // Config

  socket.on('updateCurrency', (data) => { doDb('updateCurrency', data) })

  socket.on('updateDenominations', (data) => { doDb('updateDenominations', data) })

  socket.on('updateRoles', (data) => { doDb('updateRoles', data) })

  socket.on('updateInterval', (data) => { doDb('updateInterval', data) })

  socket.on('updateDemoTimeLimit', (data) => { doDb('updateDemoTimeLimit', data) })

  socket.on('updateClickTimeLimit', (data) => { doDb('updateClickTimeLimit', data) })

  socket.on('updateDemoValueTimeLimit', (data) => { doDb('updateDemoValueTimeLimit', data) })

  socket.on('updateClickValueTimeLimit', (data) => { doDb('updateClickValueTimeLimit', data) })

  socket.on('updateClickOnCoins', (data) => { doDb('updateClickOnCoins', data) })

  // Learnings

  socket.on('showLearnings', (data) => { emit('showLearnings', data) })

  socket.on('hideLearnings', (data) => { emit('hideLearnings', data) })

  socket.on('incrementLearnings', (data) => { emit('incrementLearnings', data) })

  // ---------------------------------------------------

  //socket.on("go", (data) => { emit("go", data) })

  socket.on('updateMyName', (data) => { emit('updateMyName', data) })

  //socket.on("addMyNameAsAPlayer", (data) => { emit("addMyNameAsAPlayer", data) })

  //socket.on("updatePlayers", (data) => { emit("updatePlayers", data) })

  //socket.on("updateGameState", (data) => { emit("updateGameState", data) })

})

const port = process.argv[2] || 3000

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
