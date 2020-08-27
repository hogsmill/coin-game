<template>

  <div class="config card bg-light mb-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">Roles</h5>
        <span v-if="showRoles"  @click="setShowRoles(false)">&#9650;</span>
        <span v-if="!showRoles"  @click="setShowRoles(true)">&#9660;</span>
      </div>
      <div v-if="showRoles">
        <form class="form-inline" v-for="(role, roleIndex) in gameState.roles" :key="roleIndex">
          <div class="form-check mb-2 mr-sm-2">
            <input
              class="form-check-input mr-neg-10"
              type="checkbox"
              checked="role.include"
              v-model.lazy="role.include"
              @change="updateRole(role)"
           />
          </div>
          <button
            @click.prevent="addBefore(role)"
            class="btn btn-site-primary mb-2"
            data-toggle="tooltip" data-placement="top" title="Add role before">+ &xutri;</button>
          <button
            v-if="role.role != 'Customer'"
            @click.prevent="addAfter(role)"
            class="btn btn-site-primary mb-2"
            data-toggle="tooltip" data-placement="top" title="Add role after">+ &xdtri;</button>
          <input
            type="text"
            class="form-control mb-2 ml-1 col-md-5"
            v-bind:id="role.role.replace(' ', '')"
            v-model.lazy="role.role"/>
          <button
            class="btn btn-site-primary mb-2 update-role"
            @click.prevent="updateRoles()"
            @click="updateRoles()"
            data-toggle="tooltip" data-placement="top" title="Update role">&crarr;</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showRoles: false
    }
  },
  methods: {
    setShowRoles(val) {
      this.showRoles = val
    },
    newRole() {
      return { role: "New Role", include: true, name: "" }
    },
    addBefore(role) {
      var roles = [];
      for (var i = 0; i < this.gameState.roles.length; i++) {
        if (role.role == this.gameState.roles[i].role) {
          roles.push(this.newRole());
        }
        roles.push(this.gameState.roles[i]);
      }
      this.socket.emit("updateRoles", { gameName: this.gameName, value: roles })
    },
    addAfter(role) {
      var roles = [];
      for (var i = 0; i < this.gameState.roles.length; i++) {
        roles.push(this.gameState.roles[i]);
        if (role.role == this.gameState.roles[i].role) {
          roles.push(this.newRole());
        }
      }
      this.socket.emit("updateRoles", { gameName: this.gameName, value: roles })
    },
    updateRole(role) {
      var roles = [];
      for (var i = 0; i < this.gameState.roles.length; i++) {
        if (role.role == this.gameState.roles[i].role) {
          roles.push(role);
        } else {
          roles.push(this.gameState.roles[i]);
        }
      }
      this.socket.emit("updateRoles", { gameName: this.gameName, value: roles })
    },
    updateRoles() {
      this.socket.emit("updateRoles", {gameName: this.gameName, value: this.gameState.roles })
    }
  },
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
  }
};
</script>

<style scoped>

</style>
