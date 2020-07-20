<template>
  <div class="card bg-light mb-3 col-custom mr-1 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Denominations</h5>
      <form class="form-inline">
        <div class="form-group">
          <label class="width-50" for="twoPound">£2</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="twoPound"
            name="twoPound"
            v-model.lazy="denominations['200']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['200']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="onePound">£1</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="onePound"
            name="onePound"
            v-model.lazy="denominations['100']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['100']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="fifty">50p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="fifty"
            name="fifty"
            v-model.lazy="denominations['50']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['50']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="twenty">20p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="twenty"
            name="twenty"
            v-model.lazy="denominations['20']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['20']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="ten">10p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="ten"
            name="ten"
            v-model.lazy="denominations['10']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['10']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="five">5p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="five"
            name="five"
            v-model.lazy="denominations['5']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['5']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="two">2p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="two"
            name="two"
            v-model.lazy="denominations['2']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['2']) }"
          ></div>
        </div>
        <div class="form-group">
          <label class="width-50" for="one">1p</label>
          <input
            type="text"
            class="form-control col-md-3"
            id="one"
            name="one"
            v-model.lazy="denominations['1']"
            v-on:change="updateDenominations()"
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['1']) }"
          ></div>
        </div>
      </form>
      <div class="mt-4">Total: £{{ total() }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'socket'
  ],
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    denominations() {
      return this.$store.getters.getDenominations;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
  methods: {
    total() {
      var total = 0;
      for (var denomination in this.denominations) {
        total += this.denominations[denomination] * denomination;
      }
      this.$store.getters.getGameState["total"] = total;
      var pounds = Math.floor(total / 100);
      var pence = total - pounds * 100;
      if (pence < 10) {
        pence = "0" + pence;
      }
      return pounds + ":" + pence;
    },
    getWidth(n) {
      var sum = 0;
      for (var denomination in this.denominations) {
        sum = sum + parseInt(this.denominations[denomination]);
      }
      return (n / sum) * 100 + "%";
    },
    updateDenominations() {
      this.socket.emit("updateDenominations", { gameName: this.gameName, value: this.denominations })
    }
  },
  mounted() {
    this.socket.on("updateDenominations", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateDenominations", data.value)
      }
    })
  }
};
</script>

<style scoped>
.col-custom {
  -ms-flex: 0 0 22%;
  flex: 0 0 22%;
  max-width: 22%;
}
</style>
