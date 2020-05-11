<template>
  <div class="results" v-if="stateSet()">
    <h2>Results</h2>
    <div class="narration"></div>
    <div class="sprint">Sprint {{state['sprint']}}</div>
    <div class="strategies">
      <table>
        <thead>
          <td :style="{ width: setWidth() }">Round</td>
          <td v-for="role in state.rounds[0]['roles']" :key="role['name']" :style="{ width: setWidth() }">{{role['name']}}</td>
          <td :style="{ width: setWidth() }">Delivered</td>
        </thead>
        <tbody>
          <tr v-for="(round, index) in state.rounds" :key="index">
            <td>{{round['round']}}</td>
            <td v-for="(role, roleindex) in state.rounds[index]['roles']" :key="roleindex">
              <CoinsView v-bind:coins="role['coins']" />
            </td>
            <td v-bind:id="round['delivered']">£0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CoinsView from './CoinsView.vue'

export default {
  name: 'Results',
  components: {
    CoinsView
  },
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
      return 100 / (this.state.rounds[0]['roles'].length + 1) + '%'
    },
    stateSet() {
      return this.state['rounds'].length
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
