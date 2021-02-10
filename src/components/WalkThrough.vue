<template>
  <span class="walk-through">
    <button v-if="!gameName && !showAbout" class="btn btn-sm btn-info mb-2" @click="help">
      Explain this for me...
    </button>

    <modal name="walk-through" id="walk-through" :height="400" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            This game demonstrates the importance of focussing on value delivery
            as the best means of satisfying customer need, and the best strategy
            for reducing risk
          </p>
          <p>
            Details on the physical game that is the basis of this one can be found
            in <a href="https://www.linkedin.com/pulse/coin-game-simple-effective-way-demonstrate-agility-steve-wells/" target="blank">
              this</a> LinkedIn post.
          </p>
          <div class="coin-game-round" />
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            Project work is simulated - in the real game - by the flipping of
            coins, and the flow of work in a project is simulated by passing the
            coins from role to role - e.g. from a designer to a dev, to a QA and
            finally delivery to the customer. (<em>yes, we know teams should be cross-functional and no roles, but
              this is just for the simulation...</em>)
          </p>
          <p>In the online version, coins are played by merely clicking them</p>
          <p>
            The value delivered is the actual value of coins passed to the
            customer
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Playing The Game</h4>
        <p>
          Two demo games are already to set up if with to use them. Simply click the
          <button class="btn btn-sm btn-secondary smaller-font">
            Set Up Game
          </button> button and select the game, either:
        </p>
        <ul>
          <li>
            Workshop <em>(None) Single Team Game</em>, game <em>Demo</em> for a game with a
            single team, or
          </li>
          <li>
            Workshop <em>Demo</em>, and one of the teams from the drop down for a workshop
            with multiple teams, to add some competition and comparison between teams
          </li>
        </ul>
        <p>
          To set up your own game, using your teams' names and roles, use the facilitator tab
          by adding <em>?host</em> to the URL:
        </p>
        <p class="center">
          <a href="http://agilesimulations.co.uk/coin-game/?host">
            http://agilesimulations.co.uk/coin-game/?host
          </a>
        </p>
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Playing The Game</h4>
        <p>
          Once the game is set up, you can optionally (but recommended..) click on the roles
          to assign players to those roles as shown below:
        </p>
        <div class="role-select">
          <div class="rounded selecting" />
          <div class="rounded selected" />
        </div>
      </div>
      <div class="mt-4" v-if="step == 5">
        <h4>Round 1: Batch Delivery</h4>
        <p>
          In this round, all coins must be played by a role before being passed
          on <em>en masse</em>.
        </p>
        <p>
          This simulates a batch, or waterfall approach.
          The round stops after {{ gameState.config.timeLimit.click }} seconds, and it is
          extremely unlikely that any value will reach the customer in this time.
        </p>
      </div>
      <div class="mt-4" v-if="step == 6">
        <h4>Round 2: Kanban Delivery</h4>
        <p>
          In this round, coins are passed on as soon as they are clicked. This
          is to simulate more of a Kanban or flow way of working
        </p>
        <p>
          There is no time limit on this round, but note the time it takes to
          deliver all the coins to the customer
        </p>
      </div>
      <div class="mt-4" v-if="step == 7">
        <h4>Round 3: Value Delivery</h4>
        <p>
          This round is also kanban (coins passed on immediately), but the timer
          stops <em>after {{ gameState.config.valueTimeLimit.click }} seconds!</em>. Coins are
          clicked highest-value first, however, and the amount of value delivered is recorded.
        </p>
        <p>
          Typically, despite having only one sixth of the time of round 1, most
          of the value - usually 80% to 85% - will be delivered. This will also
          typically be in 50% or less of the time of round 2, so most of the
          value is delivered in much less time.
        </p>
        <p>This is the light bulb moment...</p>
      </div>
      <div class="mt-4" v-if="step == 8">
        <h4>Game Play</h4>
        <p>
          Click the 'Play' buttons to play each round of the game as you would
          round a table; everybody's browser will update as the coins are
          clicked, so the next role can click coins as soon as they are
          available to be played
        </p>
        <p>
          Enjoy!
        </p>
        <!--
        <p>
          The game can also be run in demo mode; if you're presenting to
          management or C-Suite, or doing an online presentation (<em>not currently available</em>)
        </p>
        -->
      </div>
      <div class="buttons" v-if="step < 8">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="skip()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == 8">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </span>
</template>

<script>
import params from '../lib/params.js'

export default {
  data() {
    return {
      step: 1
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    show() {
      this.$modal.show('walk-through')
    },
    skip() {
      this.hide()
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      this.step = this.step + 1
    }
  },
}
</script>

<style lang="scss">
.walk-through {
  button {

  }
}

.buttons {
  padding: 6px;
  position: absolute;
  bottom: 20px;
  left: 228px;
}

#walk-through {
  p {
    text-align: left;
    margin: 0 24px 12px 24px;

    &.center {
      text-align: center;
    }
  }
  ul {
    margin-bottom: 12px;

    li {
      margin: 6px 24px 12px 36px;
      text-align: left;
    }
  }
}
.coin-game-round {
  width: 500px;
  height: 80px;
  margin: 0 auto;
  background-image: url("../assets/img/coin-game-round.png");
}
.walkthrough-graph {
  height: 100%;
  margin-left: 8px;
  width: 310px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: center;
}
.conclusions p {
  text-align: left;
}
.risk-graph {
  background-image: url("../assets/img/risk.png");
}
.value-graph {
  margin-left: 8px;
  background-image: url("../assets/img/value.png");
}

.role-select {
  margin: 0 auto;

  div {
    margin: 12px;
    border: 1px solid #ccc;
    height: 190px;
    width: 200px;
    display: inline-block;
    box-shadow: 2px 2px 3px #aaa;

    &.selecting {
      background-image: url("../assets/img/coin-game-role-select.jpg");
    }
    &.selected {
      background-image: url("../assets/img/coin-game-role-selected.jpg");
    }
  }
}
</style>
