<template>
  <div class="card bg-light mb-3 col-md-3 no-padding-r-l" v-if="!stateSet">
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
          />
          <div
            class="distribution"
            :style="{ width: getWidth(denominations['1']) }"
          ></div>
        </div>
      </form>

      Total: £{{ total() }}
    </div>
  </div>
  <!-- <div class="denominations" v-if="!stateSet">
    <h2>Denominations</h2>
    <form class="form-inline">
      <div class="form-group">
        <label for="twoPound">£2</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="twoPound"
          name="twoPound"
          v-model.lazy="denominations['200']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['200']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="onePound">£1</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="onePound"
          name="onePound"
          v-model.lazy="denominations['100']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['100']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="fifty">50p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="fifty"
          name="fifty"
          v-model.lazy="denominations['50']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['50']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="twenty">20p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="twenty"
          name="twenty"
          v-model.lazy="denominations['20']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['20']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="ten">10p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="ten"
          name="ten"
          v-model.lazy="denominations['10']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['10']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="five">5p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="five"
          name="five"
          v-model.lazy="denominations['5']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['5']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="two">2p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="two"
          name="two"
          v-model.lazy="denominations['2']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['2']) }"
        ></div>
      </div>
      <div class="form-group">
        <label for="one">1p</label>
        <input
          type="text"
          class="form-control col-md-3"
          id="one"
          name="one"
          v-model.lazy="denominations['1']"
        />
        <div
          class="distribution"
          :style="{ width: getWidth(denominations['1']) }"
        ></div>
      </div>
    </form>

    Total: £{{ total() }}
  </div> -->
</template>

<script>
export default {
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
  },
};
</script>
