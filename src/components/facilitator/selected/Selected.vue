<template>
  <div class="selected-header">
    Workshop: <b>{{ editingWorkshop.workshopName }}</b>, Game: <b>{{ editingGame.gameName }}</b>
  </div>
</template>

<script>
export default {
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  }
}
</script>

<style lang="scss">
  .selected-header {
    padding: 0 0 12px 22px;
    text-align: left;
  }
</style>
