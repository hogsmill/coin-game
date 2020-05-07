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
          <input type="radio" id="fullRun" name="fullRun" value="Full Run" v-model="state['runType']">
          <label for="fullRun">Full Run</label>
        </div>
        <div>
          <input type="radio" id="fullRound" name="fullRound" value="Round AT A Time" v-model="state['runType']">
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
        { name: 'Product Owner', include: true },
        { name: 'Developer', include: true },
        { name: 'Tester',  include: true },
        { name: 'Integrator', include: true },
        { name: 'Customer', include: true }
      ],
      state: {
        runType: 'Full Run',
        sprint: 0,
        coins: [],
        roles: []
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
    go() {
      this.state['coins'] = []
      for (var denomination in this.denominations) {
        for (var i = 0; i < this.denominations[denomination]; i++) {
          this.state['coins'].push(denomination)
        }
      }
      this.state['roles'] = []
      for (i = 0; i < this.roles.length; i++) {
        if (this.roles[i]['include']) {
          this.state['roles'].push(this.roles[i]['name'])
        }
      }
      console.log(this.state)
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
