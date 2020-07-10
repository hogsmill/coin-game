import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    walkThrough: false,
    host: false,
    showAbout: false,
    gameName: '',
    myName: '',
    players: [],
    clickedRole: {},
    gameState: {
      stateSet: false,
      interval: 250,
      stopped: false,
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
      roles: [
        { role: "Product Owner", include: true, name: "" },
        { role: "Developer", include: true, name: "" },
        { role: "Tester", include: true, name: "" },
        { role: "Integrator", include: true, name: "" },
        { role: "Customer", include: true, name: "" },
      ],
      rounds: [
        {
          name: "Batch",
          roles: [],
          current: false,
          delivered: 0,
          time: 0,
        },
        {
          name: "Kanban",
          roles: [],
          current: false,
          delivered: 0,
          time: 0,
        },
        {
          name: "Value First",
          roles: [],
          current: false,
          delivered: 0,
          time: 0,
        },
      ],
    },
  },
  getters: {
    getWalkThrough: (state) => {
      return state.walkThrough;
    },
    getHost: (state) => {
      return state.host;
    },
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getGameName: (state) => {
      return state.gameName;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getPlayers: (state) => {
      return state.players;
    },
    getStateSet: (state) => {
      return state.gameState.stateSet;
    },
    getInterval: (state) => {
      return state.gameState.interval;
    },
    getStopped: (state) => {
      return state.gameState.stopped;
    },
    getDenominations: (state) => {
      return state.gameState.denominations;
    },
    getGameState: (state) => {
      return state.gameState;
    },
  },
  mutations: {
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload;
    },
    updateHost: (state, payload) => {
      state.host = payload;
    },
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
    },
    updateMyName: (state, payload) => {
      state.myName = payload;
    },
    addPlayer: (state, payload) => {
      var found = false
      for (var i = 0; i < state.players.length; i++) {
        if (state.players[i] == payload) {
          found = true
        }
      }
      if (!found) {
        state.players.push(payload)
      }
    },
    updateStateSet: (state, payload) => {
      state.gameState.stateSet = payload;
    },
    updateInterval: (state, payload) => {
      state.gameState.interval = payload;
    },
    updateStopped: (state, payload) => {
      state.gameState.stopped = payload;
    },
    updateDenominations: (state, payload) => {
      state.gameState.denominations = payload;
    },
    updateGameState: (state, payload) => {
      state.gameState = payload;
    },
    updateGameStateRoles: (state, payload) => {
      state.gameState.roles = payload;
      var i, roles = []
      for (i = 0; i < payload.length; i++) {
        if (payload[i].include) {
          roles.push(payload[i])
        }
      }
      for (i = 0; i < state.gameState.rounds.length; i++) {
        state.gameState.rounds[i].roles = roles
      }
    },
    updatePlayers: (state, payload) => {
      state.players = payload;
    },
    updateGameStateRound: (state, payload) => {
      state.gameState.round = payload;
    },
    updateGameStateClickCoins: (state, payload) => {
      state.gameState.clickCoins = payload;
    }
  },
  actions: {
    updateWalkThrough: ({ commit }, payload) => {
      commit("updateWalkThrough", payload);
    },
    updateHost: ({ commit }, payload) => {
      commit("updateHost", payload);
    },
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    updateMyName: ({ commit }, payload) => {
      commit("updateMyName", payload);
    },
    updatePlayers: ({ commit }, payload) => {
      commit("updatePlayers", payload);
    },
    addPlayer: ({ commit }, payload) => {
      commit("addPlayer", payload);
    },
    updateStateSet: ({ commit }, payload) => {
      commit("updateStateSet", payload);
    },
    updateInterval: ({ commit }, payload) => {
      commit("updateInterval", payload);
    },
    updateStopped: ({ commit }, payload) => {
      commit("updateStopped", payload);
    },
    updateDenominations: ({ commit }, payload) => {
      commit("updateDenominations", payload);
    },
    updateGameState: ({ commit }, payload) => {
      commit("updateGameState", payload);
    },
    updateGameStateRoles: ({ commit }, payload) => {
      commit("updateGameStateRoles", payload);
    },
    updateGameStateClickCoins: ({ commit }, payload) => {
      commit("updateGameStateClickCoins", payload);
    },
    updateGameStateRound: ({ commit }, payload) => {
      commit("updateGameStateRound", payload);
    }
  },
});
