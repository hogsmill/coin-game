import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    walkThrough: false,
    host: false,
    showTab: 'game',
    gameName: '',
    myName: '',
    clickedRole: {},
    gameState: {
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
      players: [],
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
    getShowTab: (state) => {
      return state.showTab;
    },
    getGameName: (state) => {
      return state.gameName;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getPlayers: (state) => {
      return state.gameState.players;
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
    updateShowTab: (state, payload) => {
      state.showTab = payload;
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
    },
    setMyName: (state, payload) => {
      state.myName = payload;
    },
    changeName: (state, payload) => {
      state.myName.name = payload.name;
    },
    addPlayer: (state, payload) => {
      var found = false
      for (var i = 0; i < state.gameState.players.length; i++) {
        if (state.gameState.players[i] == payload) {
          found = true
        }
      }
      if (!found) {
        state.gameState.players.push(payload)
      }
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
      state.gameState = payload.gameState;
      var roles = []
      for (var r = 0; r < state.gameState.roles.length; r++) {
        if (state.gameState.roles[r].include) {
          roles.push(state.gameState.roles[r])
        }
      }
      for (var i = 0; i < state.gameState.roles.length; i++) {
        for (var j = 0; j < state.gameState.rounds.length; j++) {
          state.gameState.rounds[j].roles = roles
        }
      }
    },
    //updateGameStateRoles: (state, payload) => {
    //  state.gameState.roles = payload;
    //  var i, roles = []
    //  for (i = 0; i < payload.length; i++) {
    //    if (payload[i].include) {
    //      roles.push(payload[i])
    //    }
    //  }
    //  for (i = 0; i < state.gameState.rounds.length; i++) {
    //    state.gameState.rounds[i].roles = roles
    //  }
    //},
    updatePlayers: (state, payload) => {
      state.gameState.players = payload;
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
    updateShowTab: ({ commit }, payload) => {
      commit("updateShowTab", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    setMyName: ({ commit }, payload) => {
      commit("setMyName", payload);
    },
    changeName: ({ commit }, payload) => {
      commit("changeName", payload);
    },
    updatePlayers: ({ commit }, payload) => {
      commit("updatePlayers", payload);
    },
    addMyNameAsAPlayer: ({ commit }, payload) => {
      commit("addPlayer", payload);
    },
    addPlayer: ({ commit }, payload) => {
      commit("addPlayer", payload);
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
