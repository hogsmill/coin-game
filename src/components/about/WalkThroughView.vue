<template>
<div>
  <button class="btn btn-sm btn-info" @click="show">Help</button>
  <modal name="walk-through" id="walk-through" :classes="['rounded']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4" v-if="step == 1">
      <h4>Welcome to the Coin Game</h4>
      <div>
        <p>This simulation shows the importance of focussing on value delivery
          as the best means of satisfying customer need, and the best
          strategy for reducing risk</p>
        <div class="coin-game-round"> </div>
      </div>
    </div>
    <div class="mt-4" v-if="step == 2">
      <h4>Welcome to the Coin Game</h4>
      <div>
        <p>Project work is simulated - in the real game - by the flipping of coins,
          and the flow of work in a project is simulated by passing the coins from
          role to role - e.g. from a designer to a dev, to a QA and finally
          delivery to the customer. (<em>yes, we know teams should be cross-functional
          and no roles, but this is just for the simulation...</em>)</p>
        <p>In the online version, coins are played by merely clicking them</p>
        <p>The value delivered is the actual value of coins passed to the
          customer</p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 3">
      <h4>Round 1: Batch Delivery</h4>
      <p>In this round, all coins must be played by a role before being passed on
        <em>en masse</em>. This simulates a batch, or waterfall approach. The round
        stops after 1 minute, and it is extremely unlikely that any value will reach
        the customer in this time.</p>
    </div>
    <div class="mt-4" v-if="step == 4">
      <h4>Round 2: Kanban Delivery</h4>
    </div>
    <div class="mt-4" v-if="step == 5">
      <h4>Round 1: Value Delivery</h4>
    </div>
    <div class="mt-4" v-if="step == 6">
      <h4>Game Play</h4>
      <p>Check the <em>Click Coins</em> checkbox to play the game as you would round a
       table; everybody's browser will update as the coins are clicked, so the next
       role can click coins as soon as they are available to be played</p>
     <p>Uncheck the box to run in demo mode; if you're presenting to management or
      C-Suite, or doing an online presentation</p>
    </div>
    <div class="mt-4" v-if="step == 7">
      <h4>Conclusions</h4>
      <div class="walkthrough-graph risk-graph"></div>
    </div>
    <div class="mt-4" v-if="step == 8">
      <h4>Conclusions</h4>
      <div class="walkthrough-graph value-graph"></div>
    </div>
    <div class="buttons">
      <button class="btn btn-info" @click="incrementStep">Next</button>
      <button class="btn btn-info" @click="hide()">Skip</button>
    </div>
  </modal>
</div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      default: { width: 600, height: 200 },
      positions: {
        2: { height: 310 },
        3: { target: "batch-button", width: 400, height: 230 },
        4: { target: "kanban-button", width: 400, height: 200 },
        5: { target: "value-delivery-button", width: 400, height: 200 },
        6: { target: "click-coins", width: 400, height: 300 },
        7: { height: 400 },
        8: { height: 400 }
      }
    }
  },
  methods: {
    setDefault() {
      var elem = document.getElementsByClassName("vm--modal")[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show("walk-through");
    },
    hide() {
      this.$modal.hide("walk-through");
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      var elem = document.getElementsByClassName("vm--modal")[0]
      var target, positions = {}
      if (this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30

      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
  },
  created() {
    if (location.search.match("walkThrough")) {
      console.log(this.walkThrough)
      this.$store.dispatch("updateWalkThrough", true)
      this.show()
    }
  }
}
</script>

<style>
  .buttons { padding: 6px; }
  #walk-through p { margin-left: 8px; margin-right: 8px; }
  .coin-game-round { width: 500px; height: 80px; margin: 0 auto; background-image:  url("../../assets/img/coin-game-round.png"); }
  .walkthrough-graph { width: 300px; height: 225px; margin: 0 auto; }
  .risk-graph { background-image:  url("../../assets/img/risk.png"); }
  .value-graph { background-image:  url("../../assets/img/value.png"); }
</style>
