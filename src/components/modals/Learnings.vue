<template>
  <vue-final-modal name="learnings" classes="modal-container" content-class="vfm__content modal-content learnings" v-model="modals['learnings']">
    <div class="mt-4 conclusions" v-if="step == 1">
      <h4>Results</h4>
      <div class="row">
        <SingleTeam v-if="workshop.single" />
        <MultipleTeams v-if="!workshop.single" />
      </div>
    </div>
    <div class="mt-4 conclusions" v-if="step == 2">
      <h4>Conclusions (1)</h4>
      <div class="row">
        <div class="col">
          <div class="walkthrough-graph value-graph" />
        </div>
        <div class="col">
          <p>
            This graph demonstrates how we managed to deliver 80% of the value in the
            final 10 second round - by delivering the highest value items first.
          </p>
          <p>
            As we deliver items in this way, the reduce in value until, at
            some point - X on the graph - it actually costs us more to deliver
            something than the value we get in return. At this point (at the
            latest!), we should stop, or at least pivot onto something that
            delivers more value.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4 conclusions" v-if="step == 3">
      <h4>Conclusions (2)</h4>
      <div class="row">
        <div class="col">
          <div class="walkthrough-graph risk-graph" />
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
    <div class="mt-4 conclusions" v-if="step == 4">
      <h4>Conclusions (2)</h4>
      <div class="row">
        <div class="col">
          <div class="walkthrough-graph risk-graph" />
        </div>
        <div class="col">
          <p>
            This is something to consider in highly regulated industries,
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
    <div class="buttons">
      <button v-if="step < 4" class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button v-if="step >= 4" class="btn btn-info" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import SingleTeam from './learnings/SingleTeam.vue'
import MultipleTeams from './learnings/MultipleTeams.vue'

export default {
  components: {
    VueFinalModal,
    SingleTeam,
    MultipleTeams
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    workshop() {
      return this.$store.getters.getWorkshop
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    bus.on('hideLearnings', (data) => {
      if (this.scope(data, this.workshopName, self.gameName)) {
        this.$store.dispatch('hideModal', 'learnings')
      }
    })

    bus.on('incrementLearnings', (data) => {
      if (this.scope(data, this.workshopName, this.gameName)) {
        this._incrementStep()
      }
    })
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'learnings')
    },
    scope(data, workshopName, gameName) {
      return data.single
        ? this.workshop.single && this.gameName == data.gameName
        : this.workshopName == data.workshopName && this.gameName == data.gameName
    },
    incrementStep() {
      bus.emit('sendIncrementLearnings', { workshopName: this.workshopName, gameName: this.gameName })
    },
    _incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .learnings {
    height: 450px;
  }
</style>
