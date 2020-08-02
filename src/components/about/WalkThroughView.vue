<template>
  <div>
    <button
      v-if="walkThrough && !showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            This simulation shows the importance of focussing on value delivery
            as the best means of satisfying customer need, and the best strategy
            for reducing risk
          </p>
          <div class="coin-game-round"></div>
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            Project work is simulated - in the real game - by the flipping of
            coins, and the flow of work in a project is simulated by passing the
            coins from role to role - e.g. from a designer to a dev, to a QA and
            finally delivery to the customer. (<em
              >yes, we know teams should be cross-functional and no roles, but
              this is just for the simulation...</em
            >)
          </p>
          <p>In the online version, coins are played by merely clicking them</p>
          <p>
            The value delivered is the actual value of coins passed to the
            customer
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Round 1: Batch Delivery</h4>
        <p>
          In this round, all coins must be played by a role before being passed
          on <em>en masse</em>. This simulates a batch, or waterfall approach.
          The round stops after 1 minute, and it is extremely unlikely that any
          value will reach the customer in this time.
        </p>
      </div>
      <div class="mt-4" v-if="step == 4">
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
      <div class="mt-4" v-if="step == 5">
        <h4>Round 3: Value Delivery</h4>
        <p>
          This round is also kanban (coins passed on immediately), but the timer
          stops <em>after 10 seconds!</em>. Coins are click highest-value first,
          however, and the amount of value delivered is recorded.
        </p>
        <p>
          typically, despite having only one sixth of the time of round 1, most
          of the value - usually 80% to 85% - will be delivered. This will also
          typically be in 50% or less of the time of round 2, so most of the
          value is delivered in much less time.
        </p>
        <p>This is the light bulb moment...</p>
      </div>
      <div class="mt-4" v-if="step == 6">
        <h4>Game Play</h4>
        <p>
          Check the <em>Click Coins</em> checkbox to play the game as you would
          round a table; everybody's browser will update as the coins are
          clicked, so the next role can click coins as soon as they are
          available to be played
        </p>
        <p>
          Uncheck the box to run in demo mode; if you're presenting to
          management or C-Suite, or doing an online presentation
        </p>
      </div>
      <div class="mt-4" v-if="step == 7">
        <h4>Game Play</h4>
        <p>
          Click on the role in the header of this table to add the real names of
          people playing the game, so you can see who's moving coins, and chivvy
          them along accordingly...
        </p>
      </div>
      <div class="mt-4 conclusions" v-if="step == 8">
        <h4>Conclusions (1)</h4>
        <div class="row">
          <div class="col">
            <div class="walkthrough-graph value-graph"></div>
          </div>
          <div class="col">
            <p>
              Show players the following graph and point out how it tails off -
              this is how we delivered 80% of the value in the final 10 second
              round, by delivering the highest value items first.
            </p>
            <p>
              If you draw the curve first, you can then add in the costs over
              time and show the point - X - at which the value we're delivering
              is less than the cost of delivering it. At this point (at the
              latest!), we should stop, or at least pivot onto something that
              delivers more value.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 conclusions" v-if="step == 9">
        <h4>Conclusions (2)</h4>
        <div class="row">
          <div class="col">
            <div class="walkthrough-graph risk-graph"></div>
          </div>
          <div class="col">
            <p>
              This graph shows that waiting until everything is done - Round One
              - is a huge risk (red hatching). If you take this approach and
              miss the deadline, you have spent all the money and delivered no
              value. The iterative approach reduces that risk to a small amount
              per iteration; whenever you stop development (after the first
              iteration) you have always delivered some value. And, of course,
              if you deliver the wrong thing, you've only wasted one iteration's
              worth of effort and can pivot onto the right thing very quickly...
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 conclusions" v-if="step == 10">
        <h4>Conclusions (2)</h4>
        <div class="row">
          <div class="col">
            <div class="walkthrough-graph risk-graph"></div>
          </div>
          <div class="col">
            <p>
              This is a useful point to make in highly regulated industries,
              e.g. banking – an argument against delivering highest value first
              is often “it all has to be delivered anyway, so why bother?”. If
              you can deliver 90% of some regulatory requirement before a
              deadline, that reduces the risk of fines, etc. enormously. The
              final few low-value, and presumably low-risk, items will likely be
              not used much anyway. Also, if the regulators come to inspect,
              they are likely to be more lenient if you have delivered 90% of
              what is required at the deadline rather than having 100%
              “dev-complete” or “in test”.
            </p>
          </div>
        </div>
      </div>
      <div class="buttons" v-if="step < 10">
        <button class="btn btn-info" @click="incrementStep">Next</button>
        <button class="btn btn-info" @click="hide()">Skip</button>
      </div>
      <div class="buttons" v-if="step == 10">
        <button class="btn btn-info" @click="hide()">Play Game</button>
      </div>
    </modal>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1
    };
  },
  methods: {
    show() {
      this.$modal.show("walk-through");
    },
    hide() {
      this.$modal.hide("walk-through");
    },
    help() {
      this.step = 1;
      this.show();
    },
    incrementStep() {
      this.step = this.step + 1;
      var elem = document.getElementsByClassName("vm--modal")[0];
      elem.style.minWidth = "320px";
      elem.style.maxWidth = "740px";
      elem.style.width = "50%";
      elem.style.height = "420px";
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
  },
  mounted() {
    const self = this;
    if (params.isParam("walkThrough")) {
      self.$store.dispatch("updateWalkThrough", true);
      self.$modal.show("walk-through");
    }
  },
};
</script>

<style>
.buttons {
  padding: 6px;
}
#walk-through p {
  margin-left: 8px;
  margin-right: 8px;
}
.coin-game-round {
  width: 500px;
  height: 80px;
  margin: 0 auto;
  background-image: url("../../assets/img/coin-game-round.png");
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
  background-image: url("../../assets/img/risk.png");
}
.value-graph {
  margin-left: 8px;
  background-image: url("../../assets/img/value.png");
}
</style>
