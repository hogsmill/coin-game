import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'The Coin Game',
    connections: 0,
    walkThrough: false,
    host: false,
    showTab: 'game',
    workshop: false,
    workshopName: '',
    workshopResults: [],
    gameName: '',
    myName: '',
    clickedRole: {},
    gameState: {
      interval: 250,
      stopped: false,
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
      timeLimit: { demo: 60, click: 120 },
      valueTimeLimit: { demo: 10, click: 20 },
      clickOnCoins: true,
      round: 0,
      total: 0,
      valueDelivered: 0,
      players: [],
      roles: [
        { role: 'Product Owner', include: true, name: '' },
        { role: 'Developer', include: true, name: '' },
        { role: 'Tester', include: true, name: '' },
        { role: 'Integrator', include: true, name: '' },
        { role: 'Customer', include: true, name: '' },
      ],
      rounds: [
        {
          name: 'Batch',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
        {
          name: 'Kanban',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
        {
          name: 'Value First',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
      ],
    },
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getShowTab: (state) => {
      return state.showTab
    },
    getWorkshop: (state) => {
      return state.workshop
    },
    getWorkshopName: (state) => {
      return state.workshopName
    },
    getWorkshopResults: (state) => {
      return state.workshopResults
    },
    getGameName: (state) => {
      return state.gameName
    },
    getMyName: (state) => {
      return state.myName
    },
    getPlayers: (state) => {
      return state.gameState.players
    },
    getInterval: (state) => {
      return state.gameState.interval
    },
    getStopped: (state) => {
      return state.gameState.stopped
    },
    getDenominations: (state) => {
      return state.gameState.denominations
    },
    getCurrency: (state) => {
      return state.gameState.currency
    },
    getGameState: (state) => {
      return state.gameState
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateShowTab: (state, payload) => {
      state.showTab = payload
    },
    updateWorkshop: (state, payload) => {
      state.workshop = payload
    },
    updateWorkshopName: (state, payload) => {
      state.workshopName = payload
    },
    updateWorkshopResults: (state, payload) => {
      state.workshopResults = payload.workshopResults
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    setMyName: (state, payload) => {
      state.myName = payload
    },
    changeName: (state, payload) => {
      state.myName.name = payload.name
    },
    updateStopped: (state, payload) => {
      state.gameState.stopped = payload
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
      if (payload.workshopName) {
        state.workshop = true
        state.workshopName = payload.workshopName
      }
    },
    updateGameStateClickCoins: (state, payload) => {
      state.gameState.clickCoins = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateShowTab: ({ commit }, payload) => {
      commit('updateShowTab', payload)
    },
    updateWorkshop: ({ commit }, payload) => {
      commit('updateWorkshop', payload)
    },
    updateWorkshopName: ({ commit }, payload) => {
      commit('updateWorkshopName', payload)
    },
    updateWorkshopResults: ({ commit }, payload) => {
      commit('updateWorkshopResults', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    setMyName: ({ commit }, payload) => {
      commit('setMyName', payload)
    },
    changeName: ({ commit }, payload) => {
      commit('changeName', payload)
    },
    updateStopped: ({ commit }, payload) => {
      commit('updateStopped', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    updateGameStateClickCoins: ({ commit }, payload) => {
      commit('updateGameStateClickCoins', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
