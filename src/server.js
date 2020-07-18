const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var prod = os.hostname() == "agilesimulations" ? true : false

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

  socket.on("go", (data) => { emit("go", data) })

  socket.on("updateDenominations", (data) => { emit("updateDenominations", data) })

  socket.on("updateRoles", (data) => { emit("updateRoles", data) })

  socket.on("addPlayer", (data) => { emit("addPlayer", data) })

  socket.on("updateMyName", (data) => { emit("updateMyName", data) })

  socket.on("addMyNameAsAPlayer", (data) => { emit("addMyNameAsAPlayer", data) })

  socket.on("updatePlayers", (data) => { emit("updatePlayers", data) })

  socket.on("updateInterval", (data) => { emit("updateInterval", data) })

  socket.on("updateGameState", (data) => { emit("updateGameState", data) })

  socket.on("playCoin", (data) => { emit("playCoin", data) })

  socket.on("showLearnings", (data) => { emit("showLearnings", data) })

  socket.on("hideLearnings", (data) => { emit("hideLearnings", data) })
  
  socket.on("incrementLearnings", (data) => { emit("incrementLearnings", data) })
});

var port = process.argv[2] || 3000

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
