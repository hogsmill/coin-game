import Vue from "vue";
import App from "./App.vue";
import { store } from "./store/store";
import VueSocketIO from "vue-socket.io";

require("./assets/site.css");

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:3000",
    vuex: {
      store,
    },
  })
);

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
