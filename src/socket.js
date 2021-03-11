import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3000'
} else {
  connStr = 'https://agilesimulations.co.uk:3000'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendCheckSystemWorkshops', () => { socket.emit('sendCheckSystemWorkshops') })

bus.$on('sendLoadWorkshops', () => { socket.emit('sendLoadWorkshops') })

bus.$on('sendLoadWorkshop', (data) => { socket.emit('sendLoadWorkshop', data) })

bus.$on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.$on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.$on('sendStartRound', (data) => { socket.emit('sendStartRound', data) })

bus.$on('sendUpdateGameRole', (data) => { socket.emit('sendUpdateGameRole', data) })

bus.$on('sendStatus', (data) => { socket.emit('sendStatus', data) })

bus.$on('sendPlayCoin', (data) => { socket.emit('sendPlayCoin', data) })

bus.$on('sendUpdateWorkshopResults', (data) => { socket.emit('sendUpdateWorkshopResults', data) })

bus.$on('sendGetWorkshopResults', (data) => { socket.emit('sendGetWorkshopResults', data) })

bus.$on('sendHideLearnings', (data) => { socket.emit('sendHideLearnings', data) })

bus.$on('sendIncrementLearnings', (data) => { socket.emit('sendIncrementLearnings', data) })

bus.$on('sendUpdateCurrency', (data) => { socket.emit('sendUpdateCurrency', data) })

bus.$on('sendUpdateDenomination', (data) => { socket.emit('sendUpdateDenomination', data) })

bus.$on('sendUpdateInterval', (data) => { socket.emit('sendUpdateInterval', data) })

bus.$on('sendUpdateDemoTimeLimit', (data) => { socket.emit('sendUpdateDemoTimeLimit', data) })

bus.$on('sendUpdateClickTimeLimit', (data) => { socket.emit('sendUpdateClickTimeLimit', data) })

bus.$on('sendUpdateDemoValueTimeLimit', (data) => { socket.emit('sendUpdateDemoValueTimeLimit', data) })

bus.$on('sendUpdateClickValueTimeLimit', (data) => { socket.emit('sendUpdateClickValueTimeLimit', data) })

bus.$on('sendUpdateClickOnCoins', (data) => { socket.emit('sendUpdateClickOnCoins', data) })

bus.$on('sendUpdateNamedRolesClick', (data) => { socket.emit('sendUpdateNamedRolesClick', data) })

bus.$on('sendAddPlayer', (data) => { socket.emit('sendAddPlayer', data) })

bus.$on('sendChangePlayerName', (data) => { socket.emit('sendChangePlayerName', data) })

bus.$on('sendDeletePlayer', (data) => { socket.emit('sendDeletePlayer', data) })

bus.$on('sendSetRoleInclude', (data) => { socket.emit('sendSetRoleInclude', data) })

bus.$on('sendMoveRoleUp', (data) => { socket.emit('sendMoveRoleUp', data) })

bus.$on('sendUpdateRoleName', (data) => { socket.emit('sendUpdateRoleName', data) })

bus.$on('sendDeleteRole', (data) => { socket.emit('sendDeleteRole', data) })

bus.$on('sendMoveRoleDown', (data) => { socket.emit('sendMoveRoleDown', data) })

bus.$on('sendAddNewRole', (data) => { socket.emit('sendAddNewRole', data) })

bus.$on('sendLoadEditingWorkshop', (data) => { socket.emit('sendLoadEditingWorkshop', data) })

bus.$on('sendAddWorkshop', (data) => { socket.emit('sendAddWorkshop', data) })

bus.$on('sendDeleteWorkshop', (data) => { socket.emit('sendDeleteWorkshop', data) })

bus.$on('sendAddGame', (data) => { socket.emit('sendAddGame', data) })

bus.$on('sendLoadEditingGame', (data) => { socket.emit('sendLoadEditingGame', data) })

bus.$on('sendDeleteGame', (data) => { socket.emit('sendDeleteGame', data) })


// Receive

socket.on('updateWorkshops', (data) => { bus.$emit('updateWorkshops', data) })

socket.on('updateWorkshop', (data) => { bus.$emit('updateWorkshop', data) })

socket.on('updateGameState', (data) => { bus.$emit('updateGameState', data) })

socket.on('updateWorkshopResults', (data) => { bus.$emit('updateWorkshopResults', data) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

socket.on('setEditingWorkshop', (data) => { bus.$emit('setEditingWorkshop', data) })

socket.on('setEditingGame', (data) => { bus.$emit('setEditingGame', data) })

socket.on('status', (data) => { bus.$emit('status', data) })

socket.on('hideLearnings', (data) => { bus.$emit('hideLearnings', data) })

socket.on('incrementLearnings', (data) => { bus.$emit('status', data) })

export default bus
