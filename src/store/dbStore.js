
const configFuns = require('./lib/config.js')
const coinFuns = require('./lib/coins.js')
const roleFuns = require('./lib/roles.js')
const roundFuns = require('./lib/rounds.js')
const currencyFuns = require('./lib/currency.js')
const arrayFuns = require('./lib/array.js')

const { v4: uuidv4 } = require('uuid')

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
  clickOnCoins: true,
  namedRolesClick: false
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
    currentCoin: '',
    round: 0,
    total: 0,
    players: [],
    roles: roles,
    rounds: [
      { name: 'Batch', roles: [], current: false, delivered: 0, deliveredSeconds: [], time: 0 },
      { name: 'Kanban', roles: [], current: false, delivered: 0, deliveredSeconds: [], time: 0 },
      { name: 'Value First', roles: [], current: false, delivered: 0, deliveredSeconds: [], time: 0 }
    ]
  }

  gameState = _updateRoles(gameState, roles)
  return gameState
}

function _loadWorkshops(db, io, debugOn) {

  if (debugOn) { console.log('loadWorkshops') }

  db.workshopCollection.find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      io.emit('updateWorkshops', res)
    }
  })
}

function newWorkshop(name, single, isProtected) {
  return {
    workshopName: name,
    single: single,
    isProtected: isProtected,
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

function newGame(workshopName, gameName, isProtected) {
  return {
    gameName: gameName,
    workshopName: workshopName,
    isProtected: isProtected,
    gameState: createNewGame(),
    isProtected: isProtected,
    created: new Date().toISOString(),
    lastaccess: new Date().toISOString()
  }
}

function _loadWorkshop(db, io, data, debugOn) {

  db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
    if (err) throw err
    if (res) {
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        res.games = gameRes
        io.emit('updateWorkshop', res)
      })
    }
  })
}

function updateEditingWorkshop(db, io, res) {
  const id = res._id
  delete res._id
  io.emit('setEditingWorkshop', res)
  db.workshopCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
    if (err) throw err
  })
}

function updateEditingGame(db, io, res, data) {
  const id = res._id
  delete res._id
  if (res.gameName == data.gameName) {
    io.emit('setEditingGame', res)
  }
  db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
    if (err) throw err
  })
}

function _loadEditingWorkshop(db, io, data, debugOn) {

  db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
    if (err) throw err
    if (!res) {
      io.emit('setEditingWorkshop', {})
    } else {
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        res.games = gameRes
        io.emit('setEditingWorkshop', res)
      })
    }
  })
}

function _loadEditingGame(db, io, data, debugOn) {

  db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (!res) {
      io.emit('setEditingGame', {})
    } else {
      io.emit('setEditingGame', res)
    }
  })
}

function _loadGame(db, io, data, debugOn) {

  db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      db.gameCollection.updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()} }, function(err) {
        if (err) throw err
      })
      if (debugOn) { console.log('Loading game \'' + data.gameName + '\'') }
      io.emit('updateGameState', {gameName: data.gameName, workshopName: res.workshopName, gameState: res.gameState})
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

function updateTime(db, io, data) {

  db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      const gameState = res.gameState,
        t = gameState.rounds[data.round].time,
        timeLimit = configFuns.getTimeLimit(gameState, data.round),
        running = roundFuns.running(gameState.rounds[data.round], gameState, timeLimit)
      if (running) {
        gameState.rounds[data.round].time = t + 1
      } else {
        gameState.rounds[data.round].running = false
      }
      data.gameState = gameState
      db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', data)
        if (running) {
          setTimeout(function() {
            updateTime(db, io, data)
          }, 1000)
        }
      })
    }
  })
}

function _playCoin(db, io, data, debugOn) {

  if (debugOn) { console.log('playCoin', data) }

  db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
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
      db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
        if (err) throw err
        io.emit('updateGameState', data)
      })
    }
  })
}

function playNextCoins(db, io, data, debugOn) {

  if (debugOn || true) { console.log('playNextCoins') } //data) }

  db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
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
        playNextCoins(db, io, data, debugOn)
      }, gameState.config.interval)
    }
  })
}

function getGraphData(data) {
  console.log('getGraphData', data)
  const x = []
  const y = []
  if (data.length) {
    const max = arrayFuns.maxSub(data, 0)
    let second = data[0][0]
    let value = 0
    let j = 0
    for (let i = 0; i < max; i++) {
       while (j < second) {
         x.push(i)
         y.push(value)
         j++
       }
       value = data[j][i]
       x.push(second)
       y.push(value)
       second = data[j][0]
    }
  }
  return {
    x: x,
    y: y
  }
}

function getGameResults(res) {
  const results = []
  for (let i = 0; i < res.gameState.rounds.length; i++) {
    const result = {
      gameName: res.gameName,
      name: res.gameState.rounds[i].name,
      time: res.gameState.rounds[i].time,
      delivered: res.gameState.rounds[i].delivered,
      graph: getGraphData(res.gameState.rounds[i].deliveredSeconds)
    }
    results.push(result)
  }
  return results
}

module.exports = {

  loadWorkshop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadWorkshop', data) }

    _loadWorkshop(db, io, data, debugOn)
  },

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    _loadGame(db, io, data, debugOn)
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    if (data.workshopName == 'None (Single team Game)') {
      db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          const gameState = roundFuns.resetRounds(res.gameState)
          data.gameState = gameState
          db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
            if (err) throw err
            io.emit('updateGameState', data)
          })
        }
      })
    } else {
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
          const gameState = roundFuns.resetRounds(res[i].gameState)
          data.gameState = gameState
          db.gameCollection.updateOne({'_id': res[i]._id}, {$set: {gameState: gameState}}, function(err, res) {
            if (err) throw err
            io.emit('updateGameState', data)
          })
        }
      })
    }
  },

  getWorkshopResults: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getWorkshopResults', data) }

    if (data.single) {
      db.gameCollection.findOne({workshopName: 'None (Single team Game)', gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          const results = [
            getGameResults(res)
          ]
          data.workshopResults = results
          io.emit('updateWorkshopResults', data)
        }
      })
    } else {
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, res) {
        if (err) throw err
        if (res.length) {
          const results = []
          for (let r = 0; r < res.length; r++) {
            const result = getGameResults(res[r])
            results.push(result)
          }
          data.workshopResults = results
          io.emit('updateWorkshopResults', data)
        }
      })
    }
  },

  updateGameRole: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateGameRole', data) }

    db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let gameState = res.gameState
        const roles = []
        for (let i = 0; i < gameState.roles.length; i++) {
          const role = gameState.roles[i]
          if (role.role == data.role.role) {
            const roleName = gameState.players.find(function(p) {
              return p.id == data.name
            })
            role.name = roleName ? roleName : ''
          }
          roles.push(role)
        }
        gameState = _updateRoles(gameState, roles)
        data.gameState = gameState
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  startRound: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startRound', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        for (let i = 0; i < gameState.rounds.length; i++) {
          gameState.rounds[i].running = false
        }
        gameState.round = data.round
        const coins = coinFuns.getCoins(gameState.rounds[data.round].name, gameState.denominations)
        gameState.coins = coins
        gameState.rounds[data.round].roles[0].coins = coins
        gameState.rounds[data.round].running = true
        gameState.rounds[data.round].time = 0
        data.gameState = gameState
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, res) {
          if (err) throw err
          io.emit('updateGameState', data)
          updateTime(db, io, data)
          if (!gameState.config.clickOnCoins) {
            playNextCoins(db, io, data, debugOn)
          }
        })
      }
    })
  },

  playCoin: function(db, io, data, debugOn) {

    if (debugOn) { console.log('playCoin', data) }

    _playCoin(db, io, data, debugOn)
  },

  // Facilitator

  checkSystemWorkshops: function(db, io, debugOn) {

    if (debugOn) { console.log('checkSystemWorkshops') }

    const roles = [
      'Product Owner',
      'Designer',
      'Developer',
      'Tester',
      'Integrator',
      'Customer'
    ]

    const players = [
      'Steve',
      'Dolly',
      'Allan',
      'Herbert',
      'Mary'
    ]

    const singleWorkshopName = 'None (Single team Game)'
    const multipleWorkshopName = 'Workshop Demo'

    let i, j

    db.workshopCollection.findOne({single: true}, function(err, res) {
      if (err) throw err
      if (!res) {
        const workshop = newWorkshop(singleWorkshopName, true, true)
        db.workshopCollection.insertOne(workshop, function(err, res) {
          if (err) throw err
          const game = newGame(singleWorkshopName, 'Demo', true)
          const gamePlayers = []
          for (i = 0; i < players.length; i++) {
            gamePlayers.push({
              id: uuidv4(),
              name: players[i]
            })
          }
          const gameRoles = []
          for (i = 0; i < roles.length; i++) {
            gameRoles.push({
              role: roles[i],
              include: true,
              name: ''
            })
          }
          game.gameState.players = gamePlayers
          game.gameState.roles = gameRoles
          db.gameCollection.insertOne(game, function(err, gameRes) {
            if (err) throw err
          })
        })
      }
    })

    const teams = [
      'Eagle',
      'Dragon',
      'Tiger',
      'Lion'
    ]

    db.workshopCollection.findOne({workshopName: multipleWorkshopName}, function(err, res) {
      if (err) throw err
      if (!res) {
        const workshop = newWorkshop(multipleWorkshopName, false, true)
        db.workshopCollection.insertOne(workshop, function(err, res) {
          if (err) throw err
          for (i = 0; i < teams.length; i++) {
            const game = newGame(multipleWorkshopName, 'Team ' + teams[i], true)
            const gamePlayers = []
            for (j = 0; j < players.length; j++) {
              gamePlayers.push({
                id: uuidv4(),
                name: players[j] + ' ' + teams[i]
              })
            }
            const gameRoles = []
            for (j = 0; j < roles.length; j++) {
              gameRoles.push({
                role: roles[j],
                name: ''
              })
            }
            game.gameState.players = gamePlayers
            game.gameState.roles = gameRoles
            db.gameCollection.insertOne(game, function(err, gameRes) {
              if (err) throw err
            })
          }
        })
      }
    })
  },

  loadWorkshops: function(db, io, debugOn) {

    if (debugOn) { console.log('loadWorkshops') }

    _loadWorkshops(db, io, debugOn)
  },

  loadEditingWorkshop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingWorkshop', data) }

    _loadEditingWorkshop(db, io, data, debugOn)
  },

  addWorkshop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addWorkshop', data) }

    const workshop = newWorkshop(data.workshopName, false, false)
    db.workshopCollection.insertOne(workshop, function(err, res) {
      if (err) throw err
      _loadWorkshops(db, io, debugOn)
    })
  },

  deleteWorkshop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteWorkshop', data) }

    db.workshopCollection.deleteOne({workshopName: data.workshopName}, function(err, res) {
      if (err) throw err
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        if (res.length) {
          for (let r = 0; r > gameRes.length; r++) {
            db.gameCollection.deleteOne({'_id': gameRes[r]._id}, function(err, gameRes) {
              if (err) throw err
            })
          }
        }
        _loadWorkshops(db, io, debugOn)
      })
    })
  },

  loadEditingGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingGame', data) }

    _loadEditingGame(db, io, data, debugOn)
  },

  addGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addGame', data) }

    db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (!res) {
        const game = newGame(data.workshopName, data.gameName)
        db.gameCollection.insertOne(game, function(err, res) {
          if (err) throw err
          db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gamesRes) {
            if (err) throw err
            if (gamesRes.length) {
              game.games = gamesRes
              updateEditingWorkshop(db, io, game)
            }
          })
        })
      }
    })
  },

  deleteGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGame', data) }

    db.gameCollection.deleteOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      _loadEditingWorkshop(db, io, data, debugOn)
    })
  },

  addPlayer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
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

  changePlayerName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('changePlayerName', data) }

    db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const players = [], gameState = res.gameState
        for (let i = 0; i < gameState.players.length; i++) {
          const player = gameState.players[i]
          if (player.id == data.player.id) {
            player.name = data.newName
          }
          players.push(player)
        }
        gameState.players = players
        res.gameState = gameState
        updateEditingGame(db, io, res, data)
      }
    })
  },

  deletePlayer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deletePlayer', data) }

    db.gameCollection.findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const players = [], gameState = res.gameState
        for (let i = 0; i < gameState.players.length; i++) {
          if (gameState.players[i].id != data.player.id) {
            players.push(gameState.players[i])
          }
        }
        gameState.players = players
        res.gameState = gameState
        updateEditingGame(db, io, res, data)
      }
    })
  },

  updateConfig: function(db, io, data, field, debugOn) {

    if (debugOn) { console.log('updateConfig', field, data) }

    if (data.workshopName) {
      db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
        if (err) throw err
        if (res) {
          res = configFuns.setConfig(res, field, data.value)
          updateEditingWorkshop(db, io, res)
        }
      })
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
        if (err) throw err
        if (gameRes.length) {
          for (let r = 0; r < gameRes.length; r++) {
            gameRes[r].gameState = configFuns.setConfig(gameRes[r].gameState, field, data.value)
            updateEditingGame(db, io, gameRes[r], data)
          }
        }
      })
    } else {
      db.gameCollection.findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
        if (err) throw err
        if (res) {
          res.gameState = configFuns.setConfig(res.gameState, field, data.value)
          updateEditingGame(db, io, res, data)
        }
      })
    }
  },

  updateRoles: function(db, io, roleFun, data, debugOn) {

    if (debugOn) { console.log('updateRoles', roleFun, data) }

    if (data.workshopName) {
      db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
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
          db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
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
      db.gameCollection.findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
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
          res.gameState.rounds = roleFuns.updateRolesInRounds(res.gameState.rounds, res.gameState.roles)
          updateEditingGame(db, io, res, data)
        }
      })
    }
  },

  updateCurrency: function(db, io, currencyFun, data, debugOn) {

    if (debugOn) { console.log('updateCurrency', currencyFun, data) }

    if (data.workshopName) {
      db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
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
      db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
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
      db.gameCollection.findOne({workshopName: '', gameName: data.gameName}, function(err, res) {
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
  },

  resetDefaultDenominations: function(db, io, data, debugOn) {

    if (debugOn) { console.log('resetDefaultDenominations', data, denominations) }

/*
    if (data.workshopName == "None (Single team Game)") {
      db.collection('coinGame').findOne({workshopName: data.workshopName, gameName: data.gameName}, function(err, res) {
        if (err) throw err
        db.collection('coinGame').updateOne({'_id': res._id}, {$set: {'gameState.denominations': denominations}}, function(err, ) {
          if (err) throw err
          _loadWorkshops(db, io, debugOn)
        })
      })
    } else {
*/
      db.workshopCollection.findOne({workshopName: data.workshopName}, function(err, res) {
        if (err) throw err
        db.workshopCollection.updateOne({'_id': res._id}, {$set: {denominations: denominations}}, function(err, ) {
          if (err) throw err
          _loadWorkshops(db, io, debugOn)
          db.gameCollection.find({workshopName: data.workshopName}).toArray(function(err, gameRes) {
            if (err) throw err
            for (let i = 0; i < gameRes.length; i++) {
              db.gameCollection.updateOne({'_id': gameRes[i]._id}, {$set: {'gameState.denominations': denominations}}, function(err, ) {
                if (err) throw err
              })
            }
          })
        })
      })
/*
    }
*/
  }

}
