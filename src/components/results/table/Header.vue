<template>
  <thead>
    <tr>
      <td />
      <td :colspan="gameState.rounds[0]['roles'].length" class="role-click">
        <i>(Click on a role to set the player for that role)</i>
      </td>
    </tr>
    <tr>
      <td :style="{ width: setWidth() }">
        Round
      </td>
      <td v-for="role in gameState.rounds[0]['roles']" :key="role.role" :style="{ width: setWidth() }">
        <span @click="showNameEdit(role.role)"> {{ role.role }} </span>
        <div v-if="roleEditing == role.role">
          <select id="role-select" v-model="role.name" @change="updateRole(role)">
            <option value="">
              -- Select --
            </option>
            <option v-for="(player, index) in gameState.players" :key="index" :value="player.id">
              {{ player.name }}
            </option>
          </select>
        </div>
        <span v-if="roleEditing != role.role && role.name.name"><br> ({{ role.name.name }}) </span>
      </td>
      <td :style="{ width: setWidth() }">
        Delivered
      </td>
    </tr>
  </thead>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      roleEditing: ''
    }
  },
  computed: {
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    setWidth() {
      return 100 / (this.gameState.roles.length + 1) + '%'
    },
    showNameEdit(role) {
      this.roleEditing = role
    },
    updateRole(role) {
      this.roleEditing = ''
      const name = document.getElementById('role-select').value
      this.socket.emit('updateGameRole', { workshopName: this.workshopName, gameName: this.gameName, role: role, name: name })
    }
  }
}
</script>

<style lang="scss">
  .role-click {
    font-weight: normal;
    padding: 24px 0 0 0 !important;
  }

  #role-select {
    max-width: 80%;
  }
  .fas {
    font-size: x-large;
    color: #888;
    display: inline-block;
    margin: 0px 8px;
    position: relative;
    top: 4px;

    &:hover {
      cursor: pointer;
      color: #444;
    }
  }
</style>
