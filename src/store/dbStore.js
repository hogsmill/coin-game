
const configFuns = require('./lib/config.js')
const coinFuns = require('./lib/coins.js')
const roleFuns = require('./lib/roles.js')
const roundFuns = require('./lib/rounds.js')
const currencyFuns = require('./lib/currency.js')

const currencies = [
  {name: 'pound', symbol: '£', major: '&pound;', minor: 'p'},
  {name: 'euro', symbol: '€', major: '&#8364;', minor: 'c'},
  {name: 'dollar', symbol: '$', major: '&dollar;', minor: 'c;'}
]

const denominations = {
  200: 1,
  100: 7,
  50: 11,
  20: 21,
  10: 6,
  5: 6,
  2: 10,
  1: 20,
}

const config = {
  interval: 250,
  timeLimit: {demo: 60, click: 120 },
  valueTimeLimit: {demo: 10, click: 20 },
  clickOnCoins: true
}

const roles = [
  { role: 'Product Owner', include: true, name: '' },
  { role: 'Developer', include: true, name: '' },
  { role: 'Tester', include: true, name: '' },
  { role: 'Integrator', include: true, name: '' },
  { role: 'Customer', include: true, name: '' },
]

function createNewGame() {
  let gameState = {
    config: config,
    defaultConfig: config,
    currencies: currencies,
    currency: currencies[0],
    denominations: denominations,
    defaultDenominations: denominations,
    round: 0,
    total: 0,
    players: [],
    roles: roles,
    rounds: [
      { name: 'Batch', roles: [], current: false, delivered: 0, time: 0 },
      { name: 'Kanban', roles: [], current: false, delivered: 0, time: 0 },
      { name: 'Value First', roles: [], current: false, delivered: 0, time: 0 }
    ]
  }

  gameState = _updateRoles(gameState, roles)
  return gameState
}

function _loadWorkshops(db, io, debugOn) {

  if (debugOn) { console.log('loadWorkshops') }

  db.collection('coinGameWorkshops').find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      io.emit('updateWorkshops', res)
    }
  })
}

function newWorkshop(name) {
  return {
    workshopName: name,
    currencies: currencies,
    currency: currencies[0],
    denominations: denominations,
    defaultDenominations: denominations,
    config: config,
    defaultConfig: config,
    games: [],
    roles: roles,
    created: new Date().toISOString(),
    restarted: [],
    lastaccess: new Date().toISOString()
  }
}

function newGame(workshopName, gameName) {
  const game = {gameName: gameName, workshopName: workshopName, gameState: createNewGame()}
  game.created = new Date().toISOString()
  game.lastaccess = new Date().toISOString()
  return game
}

function _loadWorkshop(err, client, db, io, data, debugOn) {

  db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
    if (err) throw err
    if (!res) {
      const workshop = newWorkshop(data.workshopName)
      db.collection('coinGameWorkshops').insertOne(workshop, function(err, res) {
        if (err) throw err
        _loadWorkshops(db, io, debugOn)
        io.emit('updateWorkshop', res)
      })
    } else {
      io.emit('updateWorkshop', res)
    }
  })
}

function updateEditingWorkshop(db, io, res) {
  const id = res._id
  delete res._id
  io.emit('setEditingWorkshop', res)
  db.collection('coinGameWorkshops').updateOne({'_id': id}, {$set: res}, function(err, ) {
    if (err) throw err
  })
}

function updateEditingGame(db, io, res, data) {
  const id = res._id
  delete res._id
  if (res.gameName == data.gameName) {
    io.emit('setEditingGame', res)
  }
  db.collection('coinGame').updateOne({'_id': id}, {$set: res}, function(err, ) {
    if (err) throw err
  })
}

function _loadEditingGame(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('loadEditingGame', data) }

  db.collection('coinGame').findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      io.emit('setEditingGame', res)
    }
  })
}

function _loadGame(err, client, db, io, data, debugOn) {

  db.collection('coinGame').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      db.collection('coinGame').updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()} }, function(err) {
        if (err) throw err
      })
      if (debugOn) { console.log('Loading game \'' + data.gameName + '\'') }
      io.emit('updateGameState', {gameName: data.gameName, workshopName: res.workshopName, gameState: res.gameState})
    } else {
      const game = {gameName: data.gameName, workshopName: data.workshopName, gameState: createNewGame()}
      game.created = new Date().toISOString()
      game.lastaccess = new Date().toISOString()
      if (debugOn) { console.log('Created new game \'' + data.gameName + '\'') }
      db.collection('coinGame').insertOne(game, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', game)
        client.close()
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
      if (gameState.rounds[roundN].roles[roleN].coins && gameState.rounds[roundN].roles[roleN].coins[data.coin]) {
        gameState.rounds[roundN].roles[roleN].coins[data.coin].played = true
        gameState.rounds[roundN] = coinFuns.moveCoins(gameState.rounds[roundN])
      }
      data.gameState = gameState
      db.collection('coinGame').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', data)
        client.close()
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
      }, gameState.config.interval)
    }
  })
}

function getGameResults(res) {
  const results = []
  for (let i = 0; i < res.gameState.rounds.length; i++) {
    const result = {
      gameName: res.gameName,
      name: res.gameState.rounds[i].name,
      time: res.gameState.rounds[i].time,
      delivered: res.gameState.rounds[i].delivered
    }
    results.push(result)
  }
  return results
}

module.exports = {

  loadWorkshop: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadWorkshop', data) }

    _loadWorkshop(err, client, db, io, data, debugOn)
  },

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

  getWorkshopResults: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('getWorkshopResults', data) }

    db.collection('coinGame').find({workshopName: data.workshopName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const results = []
        for (let r = 0; r < res.length; r++) {
          const result = getGameResults(res[r])
          results.push(result)
        }
        data.workshopResults = results
        io.emit('updateWorkshopResults', data)
        client.close()
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
          client.close()
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
          if (!gameState.config.clickOnCoins) {
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

  // Facilitator

  loadWorkshops: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadWorkshops') }

    _loadWorkshops(db, io, debugOn)
  },

  loadEditingWorkshop: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingWorkshop', data) }

    db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
      if (err) throw err
      if (res) {
        io.emit('setEditingWorkshop', res)
      }
    })
  },

  loadEditingGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingGame', data) }

    _loadEditingGame(err, client, db, io, data, debugOn)
  },

  addGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addGame', data) }

    db.collection('coinGame').findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (!res) {
        const game = newGame(data.workshopName, data.gameName)
        db.collection('coinGame').insertOne(game, function(err, res) {
          if (err) throw err
        })
        db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
          if (err) throw err
          if (res) {
            const games = res.games
            games.push(data.gameName)
            res.games = games
            updateEditingWorkshop(db, io, res)
          }
        })
      }
    })
  },

  addPlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.collection('coinGame').findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const players = [], gameState = res.gameState
        for (let i = 0; i < gameState.players.length; i++) {
          if (gameState.players[i].id != data.player.id) {
            players.push(gameState.players[i])
          }
        }
        players.push(data.player)
        gameState.players = players
        res.gameState = gameState
        updateEditingGame(db, io, res, data)
      }
    })
  },

  updateConfig: function(err, client, db, io, data, field, debugOn) {

    if (debugOn) { console.log('updateConfig', field, data) }

    if (data.workshopName) {
      db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
        if (err) throw err
        if (res) {
          res = configFuns.setConfig(res, field, data.value)
          updateEditingWorkshop(db, io, res)
        }
      })
      db.collection('coinGame').find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        if (gameRes.length) {
          for (let r = 0; r < gameRes.length; r++) {
            gameRes[r].gameState = configFuns.setConfig(gameRes[r].gameState, field, data.value)
            updateEditingGame(db, io, gameRes[r], data)
          }
        }
      })
    } else {
      db.collection('coinGame').findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          res.gameState = configFuns.setConfig(res.gameState, field, data.value)
          updateEditingGame(db, io, res, data)
        }
      })
    }
  },

  updateRoles: function(err, client, db, io, roleFun, data, debugOn) {

    if (debugOn) { console.log('updateRoles', roleFun, data) }

    if (data.workshopName) {
      db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
        if (err) throw err
        if (res) {
          switch(roleFun) {
            case 'setRoleInclude':
              res.roles = roleFuns.setRoleInclude(res.roles, data.role, data.include)
              break
            case 'moveRoleUp':
              res.roles = roleFuns.moveRoleUp(res.roles, data.role)
              break
            case 'moveRoleDown':
              res.roles = roleFuns.moveRoleDown(res.roles, data.role)
              break
            case 'updateRoleName':
              res.roles = roleFuns.updateRoleName(res.roles, data.role, data.newRole)
              break
            case 'deleteRole':
              res.roles = roleFuns.deleteRole(res.roles, data.role)
              break
            case 'addNewRole':
              res.roles = roleFuns.addNewRole(res.roles, data.role)
              break
          }
          updateEditingWorkshop(db, io, res)
          db.collection('coinGame').find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
            if (err) throw err
            if (gameRes.length) {
              for (let r = 0; r < gameRes.length; r++) {
                let gameRoles
                switch(roleFun) {
                  case 'setRoleInclude':
                    gameRes[r].gameState.roles = roleFuns.setRoleInclude(gameRes[r].gameState.roles, data.role, data.include)
                    break
                  case 'moveRoleUp':
                    gameRes[r].gameState.roles = roleFuns.moveRoleUp(gameRes[r].gameState.roles, data.role)
                    break
                  case 'moveRoleDown':
                    gameRes[r].gameState.roles = roleFuns.moveRoleDown(gameRes[r].gameState.roles, data.role)
                    break
                  case 'updateRoleName':
                    gameRes[r].gameState.roles = roleFuns.updateRoleName(gameRes[r].gameState.roles, data.role, data.newRole)
                    break
                  case 'deleteRole':
                    gameRes[r].gameState.roles = roleFuns.deleteRole(gameRes[r].gameState.roles, data.role)
                    break
                  case 'addNewRole':
                    gameRes[r].gameState.roles = roleFuns.addNewRole(gameRes[r].gameState.roles, data.role)
                    break
                }
                gameRes[r].gameState.rounds = roleFuns.updateRolesInRounds(gameRes[r].gameState.rounds, gameRes[r].gameState.roles)
                updateEditingGame(db, io, gameRes[r], data)
              }
            }
          })
        }
      })
    } else {
      console.log('here')
      db.collection('coinGame').findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          let roles
          switch(roleFun) {
            case 'setRoleInclude':
              res.gameState.roles = roleFuns.setRoleInclude(res.gameState.roles, data.role, data.include)
              break
            case 'moveRoleUp':
              res.gameState.roles = roleFuns.moveRoleUp(res.gameState.roles, data.role)
              break
            case 'moveRoleDown':
              res.gameState.roles = roleFuns.moveRoleDown(res.gameState.roles, data.role)
              break
            case 'updateRoleName':
              res.gameState.roles = roleFuns.updateRoleName(res.gameState.roles, data.role, data.newRole)
              break
            case 'deleteRole':
              res.gameState.roles = roleFuns.deleteRole(res.gameState.roles, data.role)
              break
            case 'addNewRole':
              res.gameState.roles = roleFuns.addNewRole(res.gameState.roles, data.role)
              break
          }
          console.log(res.gameState.roles)
          res.gameState.rounds = roleFuns.updateRolesInRounds(res.gameState.rounds, res.gameState.roles)
          updateEditingGame(db, io, res, data)
        }
      })
    }
  },

  updateCurrency: function(err, client, db, io, currencyFun, data, debugOn) {

    if (debugOn) { console.log('updateCurrency', currencyFun, data) }

    if (data.workshopName) {
      db.collection('coinGameWorkshops').findOne({workshopName: data.workshopName}, function(err, res) {
        if (err) throw err
        if (res) {
          switch(currencyFun) {
            case 'currency':
              res.currency = currencyFuns.setCurrency(res, data.currency)
              break
            case 'denomination':
              res.denominations = currencyFuns.updateDenomination(res, data.amount, data.number)
              break
          }
          updateEditingWorkshop(db, io, res)
        }
      })
      db.collection('coinGame').find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        if (gameRes.length) {
          for (let r = 0; r < gameRes.length; r++) {
            switch(currencyFun) {
              case 'currency':
                gameRes[r].gameState.currency = currencyFuns.setCurrency(gameRes[r].gameState, data.currency)
                break
              case 'denomination':
                gameRes[r].gameState.denominations = currencyFuns.updateDenomination(gameRes[r].gameState, data.amount, data.number)
                break
            }
            updateEditingGame(db, io, gameRes[r], data)
          }
        }
      })
    } else {
      db.collection('coinGame').findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          switch(currencyFun) {
            case 'currency':
              res.gameState.currency = currencyFuns.setCurrency(res.gameState, data.currency)
              break
            case 'denomination':
              res.gameState.denominations = currencyFuns.updateDenomination(res.gameState, data.amount, data.number)
              break
          }
          updateEditingGame(db, io, res, data)
        }
      })
    }
  }

}
