<template>
  <thead>
    <tr>
      <td :style="{ width: setWidth() }">
        Round
      </td>
      <td v-for="role in gameState.rounds[0]['roles']" :key="role.role" :style="{ width: setWidth() }">
        <span @click="showNameEdit(role.role)"> {{ role.role }} </span>
        <div v-if="roleEditing == role.role">
          <select id="role-select" v-model="role.name">
            <option value=""> -- Select -- </option>
            <option v-for="(player, index) in gameState.players" :key="index" :value="player.id">
              {{ player.name }}
            </option>
          </select>
          <i class="fas fa-save" @click="updateRole(role)" />
        </div>
        <span v-if="roleEditing != role.role && role.name"><br> ({{ role.name.name }}) </span>
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
    },
  }
}
</script>

<style lang="scss">
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
