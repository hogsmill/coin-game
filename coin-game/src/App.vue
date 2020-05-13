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
      <div class="denominations" v-if="!stateSet">
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
          Total: £{{total()}}
      </div>
      <div class="roles"  v-if="!stateSet">
        <h2>Roles</h2>
        <div>
          <div v-for="role in state.roles" :key="role['name'].replace(' ', '')" class="role">
            <input type='checkbox' checked="role['include']" v-model="role['include']">
            <button @click="addBefore(role)">+ Before</button>
            <button v-if="role['name'] != 'Customer'" @click="addAfter(role)">+ After</button>
            <input type="input" class="rolename" v-bind:id="role['name'].replace(' ', '')" name="ten" v-model="role['name']">
          </div>
        </div>
      </div>
      <div class="run" :class="{ 'running': stateSet }">
        <h2>Control</h2>
        <button @click="go(0)" :disabled="state['running']">Run Batch</button>
        <button @click="go(1)" :disabled="state['running']">Run Kanban</button>
        <button @click="go(2)" :disabled="state['running']">Run Value Delivery</button>
        <button @click="stop()" v-if="stateSet && !stopped" :disabled="state['running']">Stop</button>
        <button @click="start()" v-if="stopped" :disabled="state['running']">Start</button>
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
      stateSet: false,
      stopped: false,
      denominations: {
        200: 1,
        100: 7,
        50: 11,
        20: 21,
        10: 6,
        5: 6,
        2: 10,
        1: 20
      },
      interval: 250,
      state: {
        timeLimit: 60000,
        valueTimeLimit: 10000,
        round: 0,
        total: 0,
        roles: [
          { name: 'Product Owner', include: true },
          { name: 'Developer', include: true },
          { name: 'Tester',  include: true },
          { name: 'Integrator', include: true },
          { name: 'Customer', include: true }
        ],
        rounds:  [
          {name: 'Batch', roles: [
            { name: 'Product Owner', include: true },
            { name: 'Developer', include: true },
            { name: 'Tester',  include: true },
            { name: 'Integrator', include: true },
            { name: 'Customer', include: true }
          ], current: false, delivered: 0, time: 0 },
          {name: 'Kanban', roles: [], current: false, delivered: 0, time: 0 },
          {name: 'Value First', roles: [], current: false, delivered: 0, time: 0 }
        ]
      }
    }
  },
  methods: {
    total() {
      var total = 0
      for (var denomination in this.denominations) {
        total += this.denominations[denomination] * denomination
      }
      this.state['total'] = total
      var pounds = Math.floor(total / 100)
      var pence = total - pounds * 100
      if (pence < 10) {
        pence = '0' + pence
      }
      return pounds + ':' + pence
    },
    getWidth(n) {
      var sum = 0
      for (var denomination in this.denominations) {
        sum = sum + parseInt(this.denominations[denomination])
      }
      return n / sum * 100 + '%'
    },
    addBefore(role) {
      var roles = []
      for (var i = 0; i < this.state['roles'].length; i++) {
        if (role['name'] == this.state['roles'][i]['name']) {
          roles.push({name: 'New Role', include: true})
        }
        roles.push(this.state['roles'][i])
      }
      this.state['roles'] = roles
    },
    addAfter(role) {
      var roles = []
      for (var i = 0; i < this.state['roles'].length; i++) {
        roles.push(this.state['roles'][i])
        if (role['name'] == this.state['roles'][i]['name']) {
          roles.push({name: 'New Role', include: true})
        }
      }
      this.state['roles'] = roles
    },
    allPlayed(coins) {
      var played = true
      for (var i = 0; i < coins.length; i++) {
        if (!coins[i]['played']) {
          played = false
        }
      }
      return played
    },
    setCoin(coin, i, roles) {
      if (i < roles.length - 2) {
        coin['played'] = false
      }
      return coin
    },
    deliverCoin(coin, role, round) {
      var l = round['roles'].length
      if (role.name == round['roles'][l - 1]['name']) {
        round['delivered'] = round['delivered'] + parseInt(coin['value'])
      }
    },
    moveCoins(roundNum) {
      var i, j, coin
      var round = this.state['rounds'][roundNum]
      for (i = 0; i < round['roles'].length - 1; i++) {
        if (round['roles'][i]['coins'].length && this.allPlayed(round['roles'][i]['coins'])) {
          for (j = 0; j < round['roles'][i]['coins'].length; j++) {
            coin = round['roles'][i]['coins'][j]
            coin.played = false
            round['roles'][i + 1]['coins'].push(coin)
            this.deliverCoin(coin, round['roles'][i + 1], round)
          }
          round['roles'][i]['coins'] = []
        }
      }
    },
    moveCoin(round) {
      for (var i = 0; i < this.state['rounds'][round]['roles'].length - 1; i++) {
        var roles = this.state['rounds'][round]['roles']
        var role = roles[i]
        console.log('role', role['name'])
        for (var j = 0; j < role['coins'].length; j++) {
          var coin = role['coins'][j]
          if (coin['played']) {
            coin['played'] = false
            roles[i + 1]['coins'].push(coin)
            role['coins'].splice(j, 1)
            this.deliverCoin(coin, roles[i + 1], this.state['rounds'][round])
          }
        }
      }
    },
    playCoin(coins) {
      var i = 0
      var played = false
      while (i < coins.length && !played) {
        if (!coins[i]['played']) {
          coins[i]['played'] = true
          played = true
        }
        i++
      }
    },
    playRoleCoins(round) {
      var roles = this.state['rounds'][round]['roles']
      var played
      for (var i = 0; i < roles.length; i++) {
        if (!played) {
          this.playCoin(roles[i]['coins'])
        }
      }
    },
    incrementTime(round) {
      this.state['rounds'][round]['time'] = this.state['rounds'][round]['time'] + this.interval
      return this.state['rounds'][round]['time']
    },
    complete(round) {
      var limit = this.state['rounds'][round]['name'] == 'Value First'
        ? this.state['valueTimeLimit'] : this.state['timeLimit']
       return this.state['rounds'][round]['time'] >= limit ||
        this.state['rounds'][round]['delivered'] == this.state['total']
    },
    run() {
      var round = this.state['round']
      this.playRoleCoins(round)
      console.log('round', this.state['rounds'][round])
      if (this.state['rounds'][round]['name'] == "Batch") {
        this.moveCoins(round)
      } else {
        this.moveCoin(round)
      }
      this.incrementTime(this.state['round'])
      if (!this.complete(this.state['round']) && !this.stopped) {
        setTimeout(this.run, this.interval)
      }
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array
    },
    getCoins(round) {
      var coins = []
      for (var denomination in this.denominations) {
        for (var i = 0; i < this.denominations[denomination]; i++) {
          coins.push({value: denomination, played: false})
        }
      }
      if (round == 'Value First') {
        coins = coins.sort(function(a, b) {return parseInt(b['value']) - parseInt(a['value'])})
      } else {
        coins = this.shuffleArray(coins)
      }
      return coins
    },
    start () {
      this.stopped = false
    },
    stop() {
      this.stopped = true
    },
    go(round) {
      this.stateSet = true
      this.state['round'] = round
      var roles = []
      for (var i = 0; i < this.state['roles'].length; i++) {
        if (this.state['roles'][i]['include']) {
          var role = JSON.parse(JSON.stringify(this.state['roles'][i]))
          if (i == 0) {
            role['coins'] = this.getCoins(this.state['rounds'][round]['name'])
          } else {
            role['coins'] = []
          }
          roles.push(role)
        }
      }
      this.state['rounds'][round]['roles'] = roles
      console.log(this.state)
      this.run()
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
  .run button { margin: 0 auto 6px auto; display: block; width: 130px; }
  .running { width: 100%; }
  .running button { display: inline-block; margin: 6px; }
</style>
