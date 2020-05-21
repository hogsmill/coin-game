import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    stateSet: false,
    interval: 250,
    stopped: false,
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
    updateGameState: (state, payload) => {
      state.gameState = payload;
    },
    updateGameStateRoles: (state, payload) => {
      state.gameState["roles"] = payload;
    },
    updateGameStateRound: (state, payload) => {
      state.gameState["round"] = payload;
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
    updateGameState: ({ commit }, payload) => {
      commit("updateGameState", payload);
    },
    updateGameStateRoles: ({ commit }, payload) => {
      commit("updateGameStateRoles", payload);
    },
    updateGameStateRound: ({ commit }, payload) => {
      commit("updateGameStateRound", payload);
    },
  },
});
