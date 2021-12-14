<template>
  <thead class="role-header">
    <tr>
      <td :colspan="gameState.rounds[0]['roles'].length + 2">
        Total Value to Deliver:  {{ gameState.currency.symbol }}{{ total() }}
      </td>
    </tr>
    <tr v-if="!rolesSet()">
      <td />
      <td :colspan="gameState.rounds[0]['roles'].length + 2" class="role-click">
        <i>(Click on a role or name to set the player for that role)</i>
      </td>
    </tr>
    <tr>
      <td :style="{ width: setWidth() }">
        Round
      </td>
      <td v-for="(role, rindex) in gameState.rounds[0]['roles']" :key="rindex" :style="{ width: setWidth() }">
        <span class="role-name" @click="showNameEdit(role)"> {{ role.role }} </span>
        <div v-if="roleEditing.role == role.role">
          <select id="role-select" v-model="role.name" @change="updateRole(role)">
            <option value="">
              -- Select --
            </option>
            <option v-for="(player, pindex) in gameState.players" :key="pindex" :value="player.id">
              {{ player.name }}
            </option>
          </select>
        </div>
        <span v-if="roleEditing.role != role.role && role.name.name" class="role-name" @click="showNameEdit(role)"><br> ({{ role.name.name }}) </span>
      </td>
      <td :style="{ width: setWidth() }">
        Delivered
      </td>
    </tr>
  </thead>
</template>

<script>
import bus from '../../../socket.js'

import valueFuns from '../../../lib/value.js'

export default {
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
    total() {
      return valueFuns.total(this.gameState.denominations)
    },
    rolesSet() {
      let rolesSet = true
      for (let i = 0; i < this.gameState.rounds[0]['roles'].length; i++) {
        if (!this.gameState.rounds[0]['roles'][i].name) {
          rolesSet = false
        }
      }
      return rolesSet
    },
    showNameEdit(role) {
      this.roleEditing = role
    },
    updateRole(role) {
      this.roleEditing = ''
      const name = document.getElementById('role-select').value
      bus.$emit('sendUpdateGameRole', { workshopName: this.workshopName, gameName: this.gameName, role: role, name: name })
    }
  }
}
</script>

<style lang="scss">
  .role-header {

    .role-click {
      font-weight: normal;
      padding: 24px 0 0 0 !important;
    }

    .role-name {
      padding: 4px;
      &:hover {
        cursor: pointer;
        color: #888;
      }
    }

    #role-select {
      max-width: 80%;
    }
  }
</style>
