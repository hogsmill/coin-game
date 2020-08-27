const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var dbStore = require('./store/dbStore.js')

var MongoClient = require('mongodb').MongoClient;

var prod = os.hostname() == "agilesimulations" ? true : false
var url = prod ?  "mongodb://127.0.0.1:27017/" : "mongodb://localhost:27017/"

var connectDebugOff = prod
var debugOn = !prod

var connections = {}
var maxConnections = 20

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');

    switch(fun) {
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break;
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break;
        case 'addPlayer':
          dbStore.addPlayer(err, client, db, io, data, debugOn)
          break;
        case 'updateGameRole':
          dbStore.updateGameRole(err, client, db, io, data, debugOn)
          break;

      // Config
      case 'updateDenominations':
        dbStore.updateConfig(err, client, db, io, data, 'denominations', debugOn)
        break;
      case 'updateRoles':
        dbStore.updateConfig(err, client, db, io, data, 'roles', debugOn)
        break;
      case 'updateInterval':
        dbStore.updateConfig(err, client, db, io, data, 'interval', debugOn)
        break;
      case 'updateTimeLimit':
        dbStore.updateConfig(err, client, db, io, data, 'timeLimit', debugOn)
        break;
      case 'updateClickOnCoins':
        dbStore.updateConfig(err, client, db, io, data, 'clickOnCoins', debugOn)
        break;
    }
  })
}

io.on("connection", (socket) => {
  var connection = socket.handshake.headers.host
  connections[connection] = connections[connection] ? connections[connection] + 1 : 1
  if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
  }

  socket.on("disconnect", () => {
    var connection = socket.handshake.headers.host
    connections[connection] = connections[connection] - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
  })

  socket.on("loadGame", (data) => { doDb("loadGame", data) })

  socket.on("restartGame", (data) => { doDb("restartGame", data) })

  socket.on("addPlayer", (data) => { doDb("addPlayer", data) })

  socket.on("updateGameRole", (data) => { doDb("updateGameRole", data) })

  // Config

  socket.on("updateDenominations", (data) => { doDb("updateDenominations", data) })

  socket.on("updateRoles", (data) => { doDb("updateRoles", data) })

  socket.on("updateInterval", (data) => { doDb("updateInterval", data) })

  socket.on("updateTimeLimit", (data) => { doDb("updateTimeLimit", data) })

  socket.on("updateClickOnCoins", (data) => { doDb("updateClickOnCoins", data) })

  // ---------------------------------------------------

  socket.on("go", (data) => { emit("go", data) })

  socket.on("updateMyName", (data) => { emit("updateMyName", data) })

  //socket.on("addMyNameAsAPlayer", (data) => { emit("addMyNameAsAPlayer", data) })

  //socket.on("updatePlayers", (data) => { emit("updatePlayers", data) })

  //socket.on("updateGameState", (data) => { emit("updateGameState", data) })

  socket.on("playCoin", (data) => { emit("playCoin", data) })

  socket.on("showLearnings", (data) => { emit("showLearnings", data) })

  socket.on("hideLearnings", (data) => { emit("hideLearnings", data) })

  socket.on("incrementLearnings", (data) => { emit("incrementLearnings", data) })
});

var port = process.argv[2] || 3000

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
