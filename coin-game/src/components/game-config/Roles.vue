<template>
  <div class="card bg-light mb-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Roles</h5>
      <form
        class="form-inline"
        v-for="role in gameState.roles"
        :key="role['name'].replace(' ', '')"
      >
        <div class="form-check mb-2 mr-sm-2">
          <input
            class="form-check-input mr-neg-10"
            type="checkbox"
            checked="role['include']"
            v-model="role['include']"
          />
        </div>
        <button @click="addBefore(role)" class="btn btn-info mb-2">
          + Before
        </button>
        <button
          v-if="role['name'] != 'Customer'"
          @click="addAfter(role)"
          class="btn btn-info mb-2"
        >
          + After
        </button>
        <input
          type="text"
          class="form-control mb-2 ml-1 col-md-6"
          v-bind:id="role['name'].replace(' ', '')"
          v-model.lazy="role['name']"
        />
      </form>
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
