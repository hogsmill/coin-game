<template>
  <div id="app">
    <div class="menu">
      <span @click="function() { showAbout = false}" :class="{ selected: !showAbout }">Simulation</span>
      <span @click="function() { showAbout = true}" :class="{ selected: showAbout }">About</span>
    </div>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout">
      <h1>The Coin Game</h1>
      <div class="denominations">
        <h2>Denominations</h2>
        <div>
          <label for="twoPound">£2</label>
          <input type="input" id="twoPound" name="twoPound" v-model="denominations['200']">
          <div class="distribution" :style="{ width: getWidth(denominations['200']) }"></div>
        </div>
        <div>
          <label for="onePound">£1</label>
          <input type="input" id="onePound" name="onePound" v-model="denominations['100']">
          <div class="distribution" :style="{ width: getWidth(denominations['100']) }"></div>
        </div>
        <div>
          <label for="fifty">50p</label>
          <input type="input" id="fifty" name="fifty" v-model="denominations['50']">
          <div class="distribution" :style="{ width: getWidth(denominations['50']) }"></div>
        </div>
        <div>
          <label for="twenty">20p</label>
          <input type="input" id="twenty" name="twenty" v-model="denominations['20']">
          <div class="distribution" :style="{ width: getWidth(denominations['20']) }"></div>
        </div>
        <div>
          <label for="twenty">10p</label>
          <input type="input" id="ten" name="ten" v-model="denominations['10']">
          <div class="distribution" :style="{ width: getWidth(denominations['10']) }"></div>
        </div>
        <div>
          <label for="five">5p</label>
          <input type="input" id="five" name="five" v-model="denominations['5']">
          <div class="distribution" :style="{ width: getWidth(denominations['5']) }"></div>
        </div>
        <div>
          <label for="two">2p</label>
          <input type="input" id="two" name="two" v-model="denominations['2']">
          <div class="distribution" :style="{ width: getWidth(denominations['2']) }"></div>
        </div>
        <div>
          <label for="one">1p</label>
          <input type="input" id="one" name="one" v-model="denominations['1']">
          <div class="distribution" :style="{ width: getWidth(denominations['1']) }"></div>
        </div>
      </div>
      <div class="roles">
        <h2>Roles</h2>
        <div>
          <div v-for="role in roles" :key="role['name'].replace(' ', '')" class="role">
            <input type='checkbox' checked="role['include']" v-model="role['include']">
            <button @click="addBefore(role)">+ Before</button>
            <button v-if="role['name'] != 'Customer'" @click="addAfter(role)">+ After</button>
            <input type="input" class="rolename" v-bind:id="role['name'].replace(' ', '')" name="ten" v-model="role['name']">
          </div>
        </div>
      </div>
      <div class="run">
        <h2>Control</h2>
        <div>Run Type:</div>
        <div>
          <input type="radio" id="fullRun" name="fullRun" v-model="state['runType']">
          <label for="fullRun">Full Run</label>
        </div>
        <div>
          <input type="radio" id="fullRound" name="fullRound" v-model="state['runType']">
          <label for="fullRound">Round By Round</label>
        </div>
        <button @click="go" :disabled="state['running']">Go</button>
        </div>
      <ResultsView v-bind:state="state" />
    </div>
  </div>
</template>

<script>
import AboutView from './components/AboutView.vue'
import ResultsView from './components/ResultsView.vue'

export default {
  name: 'App',
  components: {
    AboutView,
    ResultsView
  },
  data() {
    return {
      showAbout: false,
      denominations: {
        200: 1,
        100: 7,
        50: 11,
        20: 21,
        10: 6,
        5: 4,
        2: 5,
        1: 18
      },
      roles: [
        { name: 'Product Owner', include: true, coins: [] },
        { name: 'Developer', include: true, coins: [] },
        { name: 'Tester',  include: true, coins: [] },
        { name: 'Integrator', include: true, coins: [] },
        { name: 'Customer', include: true, coins: [] }
      ],
      rounds: [
        'Batch',
        'Kanban',
        'Value First'
      ],
      state: {
        runType: 'Full Run',
        sprint: 0,
        rounds: []
      }
    }
  },
  methods: {
    getWidth(n) {
      var sum = 0
      for (var denomination in this.denominations) {
        sum = sum + parseInt(this.denominations[denomination])
      }
      return n / sum * 100 + '%'
    },
    addBefore(role) {
      var roles = []
      for (var i = 0; i < this.roles.length; i++) {
        if (role['name'] == this.roles[i]['name']) {
          roles.push({name: 'New Role', include: true})
        }
        roles.push(this.roles[i])
      }
      this.roles = roles
    },
    addAfter(role) {
      var roles = []
      for (var i = 0; i < this.roles.length; i++) {
        roles.push(this.roles[i])
        if (role['name'] == this.roles[i]['name']) {
          roles.push({name: 'New Role', include: true})
        }
      }
      this.roles = roles
    },
    allPlayed(coins) {
      for (var i = 0; i < coins.length; i++) {
        if (!coins[i]['played']) {
          return false
        }
      }
      return true
    },
    batch() {
      var round = this.state['rounds'][0]
      console.log(round['name'])
      for (var i = 0; i < round['roles'].length; i++) {
        var role = round['roles'][i]
        console.log('  ' + role['name'])
        for (var j = 0; j < role['coins'].length; j++) {
          if (!role['coins'][j]['played']) {
            console.log('    Playing ' + role['coins'][j]['value'])
            role['coins'][j]['played'] = true
            setTimeout(this.batch, 200)
            return
          }
        }
      }
    },
    getCoins() {
      var coins = []
      for (var denomination in this.denominations) {
        for (var k = 0; k < this.denominations[denomination]; k++) {
          coins.push({value: denomination, played: false})
        }
      }
      return coins
    },
    go() {
      this.state['rounds'] = []
      for (var i = 0; i < this.rounds.length; i++) {
        var roles = []
        for (var j = 0; j < this.roles.length; j++) {
          if (this.roles[j]['include']) {
            var role = this.roles[j]
            if (j == 0) {
              role['coins'] = this.getCoins()
            }
            roles.push(role)
          }
        }
        this.state['rounds'].push({'round': this.rounds[i], 'roles': roles})
      }
      console.log(this.state)
      this.batch()
    }
  }
}
</script>

<style>
  .menu { text-align: right; background-color: #ccc; padding: 6px; }
  .menu span { margin: 0 4px 0 4px; }
  .menu span:hover { text-decoration: underline; }
  .selected { text-decoration: underline; font-weight: bold; }

  .denominations { width: 20%; text-align: left; margin: 0 auto; display: inline-block; vertical-align: top; }
  .denominations div { vertical-align: middle; }
  label { width: 30px; margin: 2px; display: inline-block; text-align: right; }
  input { width: 40px; padding: 2px; margin-bottom: 2px; }
  .distribution { height: 20px; width: 300px; margin: 2px 0 0 6px; background-color: green; display: inline-block; }

  .roles { width: 40%; display: inline-block; vertical-align: top;  }
  .role { width: 100%; text-align: left; }
  .role .rolename { width: 120px; }

  .run { width: 20%; display: inline-block; padding-left: 40px; }
  .run div { text-align: left; }
  .run input { width: 5%; }
  .run label { width: 80%; text-align: left; }
  .run button { margin-top: 18px; }
</style>
