
const configFuns = require('./lib/config.js')
const coinFuns = require('./lib/coins.js')
const roleFuns = require('./lib/roles.js')
const roundFuns = require('./lib/rounds.js')

function createNewGame() {
  const roles = [
    { role: 'Product Owner', include: true, name: '' },
    { role: 'Developer', include: true, name: '' },
    { role: 'Tester', include: true, name: '' },
    { role: 'Integrator', include: true, name: '' },
    { role: 'Customer', include: true, name: '' },
  ]

  let gameState = {
    interval: 250,
    currency: { major: '&pound;', minor: 'p'},
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
    timeLimit: {demo: 60, click: 120 },
    valueTimeLimit: {demo: 10, click: 20 },
    clickOnCoins: true,
    round: 0,
    total: 0,
    players: [],
    roles: [
      { role: 'Product Owner', include: true, name: '' },
      { role: 'Developer', include: true, name: '' },
      { role: 'Tester', include: true, name: '' },
      { role: 'Integrator', include: true, name: '' },
      { role: 'Customer', include: true, name: '' },
    ],
    rounds: [
      { name: 'Batch', roles: [], current: false, delivered: 0, time: 0 },
      { name: 'Kanban', roles: [], current: false, delivered: 0, time: 0 },
      { name: 'Value First', roles: [], current: false, delivered: 0, time: 0 }
    ]
  }

  gameState = _updateRoles(gameState, roles)
  return gameState
}

function _loadGame(err, client, db, io, data, debugOn) {

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      if (debugOn) { console.log('Loading game \'' + data.gameName + '\'') }
      io.emit('updateGameState', {gameName: data.gameName, gameState: res.gameState})
    } else {
      const game = {gameName: data.gameName, gameState: createNewGame()}
      if (debugOn) { console.log('Created new game \'' + data.gameName + '\'') }
      db.collection('coinGame').insertOne(game, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', game)
      })
    }
  })
}

function _updateRoles(gameState, roles) {
  gameState.roles = roles
  for (let i = 0; i < gameState.rounds.length; i++) {
    const r = []
    for (let j = 0; j < roles.length; j++) {
      if (roles[j].include) {
        r.push({role: roles[j].role, name: roles[j].name, coins: []})
      }
    }
    gameState.rounds[i].roles = r
  }
  return gameState
}

function updateTime(err, client, db, io, data) {

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      const gameState = res.gameState,
        t = gameState.rounds[data.round].time,
        timeLimit = configFuns.getTimeLimit(gameState, data.round),
        running = gameState.rounds[data.round].running && t < timeLimit
      if (running) {
        gameState.rounds[data.round].time = t + 1
      } else {
        gameState.rounds[data.round].running = false
      }
      data.gameState = gameState
      db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', data)
        if (running) {
          setTimeout(function() {
            updateTime(err, client, db, io, data)
          }, 1000)
        }
      })
    }
  })
}

function _playCoin(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('playCoin', data) }

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      const gameState = res.gameState
      const roleN = roleFuns.getRoleNFromName(data.role, gameState.roles)
      const roundN = roundFuns.getRoundNFromName(data.round, gameState.rounds)
      if (gameState.rounds[roundN].roles[roleN].coins[data.coin]) {
        gameState.rounds[roundN].roles[roleN].coins[data.coin].played = true
        gameState.rounds[roundN] = coinFuns.moveCoins(gameState.rounds[roundN])
      }
      data.gameState = gameState
      db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', data)
      })
    }
  })
}

function playNextCoins(err, client, db, io, data, debugOn) {

  if (debugOn || true) { console.log('playNextCoins') } //data) }

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      const gameState = res.gameState
      //var roundN = roundFuns.getCurrentRound(gameState.rounds)
      //for (var i = 0; i < round.roles.length; i++) {
      //  rounds.roles[i] = roleFuns.playNextCoin(rounds.roles[i])
      //}
      //round = coinFuns.moveCoins(round)
      //round = coinFuns.moveCoins(round)

      setTimeout(function() {
        playNextCoins(err, client, db, io, data, debugOn)
      }, gameState.interval)
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
      if (err) throw err
      if (res) {
        const players = [], gameState = res.gameState
        for (let i = 0; i < gameState.players.length; i++) {
          if (gameState.players[i].id != data.name.id) {
            players.push(gameState.players[i])
          }
        }
        players.push(data.name)
        gameState.players = players
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  updateGameRole: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateGameRole', data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let gameState = res.gameState
        const roles = []
        for (let i = 0; i < gameState.roles.length; i++) {
          const role = gameState.roles[i]
          if (role.role == data.role.role) {
            role.name = data.name
          }
          roles.push(role)
        }
        gameState = _updateRoles(gameState, roles)
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  startRound: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('startRound', data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let gameState = res.gameState
        gameState = roundFuns.resetRounds(gameState)
        gameState.round = data.round
        const coins = coinFuns.getCoins(gameState.rounds[data.round].name, gameState.denominations)
        gameState.rounds[data.round].roles[0].coins = coins
        gameState.rounds[data.round].running = true
        gameState.rounds[data.round].time = 0
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
          updateTime(err, client, db, io, data)
          if (!gameState.clickOnCoins) {
            playNextCoins(err, client, db, io, data, debugOn)
          }
        })
      }
    })
  },

  playCoin: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('playCoin', data) }

    _playCoin(err, client, db, io, data, debugOn)
  },

  // Config

  updateConfig: function(err, client, db, io, data, field, debugOn) {

    if (debugOn) { console.log('updateConfig', field, data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        if (field.match(/\./)) {
          const fields = field.split('.')
          gameState[fields[0]][fields[1]] = data.value
        } else {
          gameState[field] = data.value
        }
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  updateRoles: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateRoles', data) }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let gameState = res.gameState
        gameState = _updateRoles(gameState, data.roles)
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  updateCurrency: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrency', data) }

    const currencies = {
      pound: { major: '&pound;', minor: 'p'},
      euro: { major: '&#8364;', minor: 'c'},
      dollar: { major: '&dollar;', minor: '&cent;'}
    }

    db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        gameState.currency = currencies[data.value]
        data.gameState = gameState
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  }

}
