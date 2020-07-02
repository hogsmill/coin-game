<template>
  <div class="card bg-light mb-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Roles</h5>
      <form
        class="form-inline"
        v-for="(role, roleIndex) in gameState.roles"
        :key="roleIndex"
      >
        <div class="form-check mb-2 mr-sm-2">
          <input
            class="form-check-input mr-neg-10"
            type="checkbox"
            checked="role.include"
            v-model="role.include"
          />
        </div>
        <button
          @click.prevent="addBefore(role)"
          class="btn btn-site-primary mb-2"
           data-toggle="tooltip" data-placement="top" title="Add role before"
        >
          + &xutri;
        </button>
        <button
          v-if="role.role != 'Customer'"
          @click.prevent="addAfter(role)"
          class="btn btn-site-primary mb-2"
          data-toggle="tooltip" data-placement="top" title="Add role after"
        >
          + &xdtri;
        </button>
        <input
          type="text"
          class="form-control mb-2 ml-1 col-md-6"
          v-bind:id="role.role.replace(' ', '')"
          v-model.lazy="role.role"
        />
        <button
          class="btn btn-site-primary mb-2 update-role"
          @click.prevent="updateRoles()"
          @click="updateRoles()"
          data-toggle="tooltip" data-placement="top" title="Update role"
        >
        &crarr;
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
  methods: {
    addBefore(role) {
      var roles = [];
      for (var i = 0; i < this.gameState.roles.length; i++) {
        if (role.role == this.gameState.roles[i].role) {
          roles.push({ name: "New Role", include: true });
        }
        roles.push(this.gameState.roles[i]);
      }
      this.socket.emit("updateRoles", roles)
    },
    addAfter(role) {
      var roles = [];
      for (var i = 0; i < this.gameState.roles.length; i++) {
        roles.push(this.gameState.roles[i]);
        if (role.role == this.gameState.roles[i].role) {
          roles.push({ name: "New Role", include: true });
        }
      }
      this.socket.emit("updateRoles", roles)
    },
    updateRoles() {
      this.socket.emit("updateRoles", this.gameState.roles)
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3000"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)
  },
  mounted() {
    this.socket.on("updateRoles", (data) => {
      this.$store.dispatch("updateGameStateRoles", data);
    })
  }
};
</script>
