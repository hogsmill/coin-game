
function createNewGame() {
  return {
    interval: 250,
    denominations: {
      200: 1,
      100: 7,
      50: 11,
      20: 21,
      10: 6,
      5: 6,
      2: 10,
      1: 20,
    },
    timeLimit: 60000,
    valueTimeLimit: 10000,
    clickOnCoins: true,
    round: 0,
    total: 0,
    players: [],
    roles: [
      { role: "Product Owner", include: true, name: "" },
      { role: "Developer", include: true, name: "" },
      { role: "Tester", include: true, name: "" },
      { role: "Integrator", include: true, name: "" },
      { role: "Customer", include: true, name: "" },
    ],
    rounds: [
      { name: "Batch", roles: [], current: false, delivered: 0, time: 0 },
      { name: "Kanban", roles: [], current: false, delivered: 0, time: 0 },
      { name: "Value First", roles: [], current: false, delivered: 0, time: 0 }
    ]
  }
}

function _loadGame(err, client, db, io, data, debugOn) {

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err;
    if (res) {
      if (debugOn) { console.log("Loading game '" + data.gameName + "'") }
      io.emit("updateGameState", {gameName: data.gameName, gameState: res.gameState})
    } else {
      var game = {gameName: data.gameName, gameState: createNewGame()}
      if (debugOn) { console.log("Created new game '" + data.gameName + "'") }
      db.collection('coinGame').insertOne(game, function(err, res) {
        if (err) throw err;
        io.emit("updateGameState", game)
      })
    }
  })
}

function updateConfig(err, client, db, io, data, field, debugOn) {

  if (debugOn) { console.log('updateInterval', data) }

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err;
    if (res) {
      var gameState = res.gameState
      gameState[field] = data.value
      data.gameState = gameState
      db.collection('coinGame').updateOne({"_id": res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err;
        io.emit("updateGameState", data)
      })
    }
  })
}
module.exports = {

  loadGame: function(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('loadGame', data) }

    _loadGame(err, client, db, io, data, debugOn)
  },

  restartGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('coinGame').deleteMany({gameName: data.gameName}, function(err, res) {
      _loadGame(err, client, db, io, data, debugOn)
    })
  },

  addPlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var i = 0, players = [], gameState = res.gameState
        for (i = 0; i < gameState.players.length; i++) {
          if (gameState.players[i].id != data.name.id) {
            players.push(gameState.players[i])
          }
        }
        players.push(data.name)
        gameState.players = players
        data.gameState = gameState
        db.collection('coinGame').updateOne({"_id": res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err;
          io.emit("updateGameState", data)
        })
      }
    })
  },

  updateGameRole: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateGameRole', data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var i = 0, roles = [], gameState = res.gameState
        for (i = 0; i < gameState.roles.length; i++) {
          role = gameState.roles[i]
          if (role.role == data.role.role) {
            role.name = data.name
          }
          roles.push(role)
        }
        gameState.roles = roles
        data.gameState = gameState
        db.collection('coinGame').updateOne({"_id": res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err;
          io.emit("updateGameState", data)
        })
      }
    })
  },

  // Config

  updateConfig: function(err, client, db, io, data, field, debugOn) {

    if (debugOn) { console.log('updateConfig', field, data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var gameState = res.gameState
        gameState[field] = data.value
        data.gameState = gameState
        db.collection('coinGame').updateOne({"_id": res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err;
          io.emit("updateGameState", data)
        })
      }
    })
  }

}
