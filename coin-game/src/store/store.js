import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
  },
  getters: {
    getShowAbout: (state) => {
      return state.showAbout;
    },
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
  },
});
