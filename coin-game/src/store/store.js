import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
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
    gameState: {
      timeLimit: 60000,
      valueTimeLimit: 10000,
      round: 0,
      total: 0,
      roles: [
        { name: "Product Owner", include: true },
        { name: "Developer", include: true },
        { name: "Tester", include: true },
        { name: "Integrator", include: true },
        { name: "Customer", include: true },
      ],
      rounds: [
        {
          name: "Batch",
          roles: [
            { name: "Product Owner", include: true },
            { name: "Developer", include: true },
            { name: "Tester", include: true },
            { name: "Integrator", include: true },
            { name: "Customer", include: true },
          ],
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
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getStateSet: (state) => {
      return state.stateSet;
    },
    getInterval: (state) => {
      return state.interval;
    },
    getStopped: (state) => {
      return state.stopped;
    },
    getDenominations: (state) => {
      return state.denominations;
    },
    getGameState: (state) => {
      return state.gameState;
    },
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    updateStateSet: (state, payload) => {
      state.stateSet = payload;
    },
    updateInterval: (state, payload) => {
      state.interval = payload;
    },
    updateStopped: (state, payload) => {
      state.stopped = payload;
    },
    updateDenominations: (state, payload) => {
      state.denominations = payload;
    },
    updateGameState: (state, payload) => {
      state.gameState = payload;
    },
    updateGameStateRoles: (state, payload) => {
      state.gameState["roles"] = payload;
    },
    updateGameStateRound: (state, payload) => {
      state.gameState["round"] = payload;
    },
    updateGameStateRoundsRoles: (state, payload) => {
      state.gameState["rounds"][payload.round]["roles"] = payload.roles;
    },
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
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
    updateGameStateRound: ({ commit }, payload) => {
      commit("updateGameStateRound", payload);
    },
    updateGameStateRoundsRoles: ({ commit }, payload) => {
      commit("updateGameStateRoundsRoles", payload);
    },
  },
});
