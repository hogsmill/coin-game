<template>
  <div class="roles" v-if="!stateSet">
    <h2>Roles</h2>
    <div>
      <div
        v-for="role in gameState.roles"
        :key="role['name'].replace(' ', '')"
        class="role"
      >
        <input
          type="checkbox"
          checked="role['include']"
          v-model="role['include']"
        />
        <button @click="addBefore(role)">+ Before</button>
        <button v-if="role['name'] != 'Customer'" @click="addAfter(role)">
          + After
        </button>
        <input
          type="input"
          class="rolename"
          v-bind:id="role['name'].replace(' ', '')"
          name="ten"
          v-model.lazy="role['name']"
        />
      </div>
    </div>
  </div>
</template>

<script>
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
      for (var i = 0; i < this.gameState["roles"].length; i++) {
        if (role["name"] == this.gameState["roles"][i]["name"]) {
          roles.push({ name: "New Role", include: true });
        }
        roles.push(this.gameState["roles"][i]);
      }
      this.$store.dispatch("updateGameStateRoles", roles);
    },
    addAfter(role) {
      var roles = [];
      for (var i = 0; i < this.gameState["roles"].length; i++) {
        roles.push(this.gameState["roles"][i]);
        if (role["name"] == this.gameState["roles"][i]["name"]) {
          roles.push({ name: "New Role", include: true });
        }
      }
      this.$store.dispatch("updateGameStateRoles", roles);
    },
  },
};
</script>
