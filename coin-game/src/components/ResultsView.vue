<template>
  <div class="results" v-if="stateSet()">
    <h2>Results</h2>
    <div class="narration"></div>
    <div class="sprint">Sprint {{state['sprint']}}</div>
    <div class="strategies">
      <table>
        <thead>
          <td :style="{ width: setWidth() }">Round</td>
          <td v-for="role in state.roles" :key="role" :style="{ width: setWidth() }">{{role}}</td>
          <td :style="{ width: setWidth() }">Delivered</td>
        </thead>
        <tbody>
          <tr v-for="round in rounds" :key="round['name']">
            <td>{{round['name']}}</td>
            <td v-for="role in state.roles" :key="role"></td>
            <td v-bind:id="round['delivered']">£0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',
  props: ['state'],
  data() {
    return {
      rounds: [
        {name: 'Batch', delivered: 0 },
        {name: 'Kanban', delivered: 0 },
        {name: 'Highest Value 1st', delivered: 0 }
      ]
    }
  },
  methods: {
    setWidth() {
      return 100 / (this.state.roles.length + 1) + '%'
    },
    stateSet() {
      return this.state['coins'].length && this.state['roles'].length
    }
  }
}
</script>

<style>
  .sprint { text-align: right; }
  .strategies { }
  table { border-collapse: collapse; margin: 0 auto; max-width: 80%; }
  thead td { font-weight: bold; }
  td { border: 1px solid; }

</style>
