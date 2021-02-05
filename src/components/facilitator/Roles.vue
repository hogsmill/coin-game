<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Roles
        </h5>
        <i v-if="showRoles" @click="setShowRoles(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showRoles" @click="setShowRoles(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showRoles">
        <Selected :scope="'workshop'" />
        <table class="config-table">
          <tr>
            <td colspan="2">
              <table class="roles">
                <tr v-for="(role, index) in editingWorkshop.roles" :key="index">
                  <td>
                    <input :disabled="index == editingWorkshop.roles.length - 1" type="checkbox" checked="role.include" @change="toggleRoleInclude(role)">
                  </td>
                  <td>
                    <i v-if="index > 0" class="fas fa-arrow-up" @click.prevent="moveRoleUp(role)" title="Move role up" />
                    <i v-if="index < editingWorkshop.roles.length - 1" class="fas fa-arrow-down" @click.prevent="moveRoleDown(role)" title="Move role down" />
                  </td>
                  <td>
                    <input type="text" :id="'role-name-' + index" :value="role.role">
                    <i class="fas fa-save" title="Save Changes" @click="updateRoleName(role, index)" />
                    <i class="far fa-trash-alt" title="Delete" @click="deleteRole(role)" />
                  </td>
                </tr>
                <tr>
                  <td colspan="2" />
                  <td colspan="2">
                    <input type="text" id="new-role">
                    <button class="btn btn-sm btn-secondary smaller-font" @click="addNewRole()">
                      Add New
                    </button>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Selected from './selected/Selected.vue'

export default {
  components: {
    Selected
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showRoles: false
    }
  },
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  },
  methods: {
    setShowRoles(val) {
      this.showRoles = val
    },
    toggleRoleInclude(role) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      this.socket.emit('setRoleInclude', {workshopName: workshop, gameName: game, role: role, include: !role.include})
    },
    moveRoleUp(role) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      this.socket.emit('moveRoleUp', {workshopName: workshop, gameName: game, role: role})
    },
    moveRoleDown(role) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      this.socket.emit('moveRoleDown', {workshopName: workshop, gameName: game, role: role})
    },
    updateRoleName(role, index) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const newRole = document.getElementById('role-name-' + index).value
      this.socket.emit('updateRoleName', {workshopName: workshop, gameName: game, role: role, newRole: newRole})
    },
    deleteRole(role) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      this.socket.emit('deleteRole', {workshopName: workshop, gameName: game, role: role})
    },
    addNewRole() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const role = document.getElementById('new-role').value
      this.socket.emit('addNewRole', {workshopName: workshop, gameName: game, role: role})
      document.getElementById('new-role').value = ''
    }
  }
}
</script>

<style lang="scss">

</style>
