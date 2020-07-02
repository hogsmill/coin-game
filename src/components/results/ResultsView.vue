<template>
  <div class="results mb-5" v-if="stateSet">
    <h2>Results</h2>
    <div class="narration"></div>
    <div class="container">
      <table class="table table-striped">
        <thead>
          <td :style="{ width: setWidth() }">Round</td>
          <td
            v-for="role in gameState.rounds[0]['roles']"
            :key="role.role"
            :style="{ width: setWidth() }"
          >
            {{ role.role }}
          </td>
          <td :style="{ width: setWidth() }">Delivered</td>
        </thead>
        <tbody>
          <tr v-for="(round, index) in gameState.rounds" :key="index">
            <td>{{ round.name }}</td>
            <td
              v-for="(role, roleIndex) in gameState.rounds[0].roles"
              :role="role"
              :roleIndex="roleIndex"
              :key="roleIndex"
            >
              <div v-if="gameState.rounds[index].roles[roleIndex]">
                <div
                  v-for="(coin, coinIndex) in gameState.rounds[index].roles[roleIndex].coins"
                  :coin="coin"
                  :coinIndex="coinIndex"
                  :key="coinIndex"
                  class="coin-parent"
                  @click="playCoin(coinIndex, gameState.rounds[index].roles[roleIndex], gameState.rounds[index])"
                >
                  <div
                    class="coin"
                    data-toggle="tooltip" data-placement="top" :title="coinNames[coin.value]"
                    :class="[getClassName(role), getValueName(coin)]"
                  ></div>
                </div>
              </div>
            </td>
            <td>
              <div>
                £{{ value(round.delivered) }} in {{ time(round.time) }}
              </div>
              <div v-if="outOfTime(round)" class="missed">Missed delivery</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Results",
  data() {
    return {
      coinClasses: {
        1: "one-p",
        2: "two-p",
        5: "five-p",
        10: "ten-p",
        20: "twenty-p",
        50: "fifty-p",
        100: "one-pound",
        200: "two-pound"
      },
      coinNames: {
        1: "1p",
        2: "2p",
        5: "5p",
        10: "10p",
        20: "20p",
        50: "50p",
        100: "£1",
        200: "£2"
      }
    };
  },
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
  methods: {
    setWidth() {
      return 100 / (this.gameState.roles.length + 1) + "%";
    },
    getClassName(role) {
      return role.role.replace(" ", "-").toLowerCase();
    },
    getValueName(coin) {
      var classStr = this.coinClasses[coin.value];
      if (coin["played"]) {
        classStr = classStr + " played";
      }
      return classStr;
    },
    time(t) {
      var secs = t / 1000;
      var minutes = Math.floor(secs / 60);
      secs = Math.floor(secs - minutes * 60);
      if (secs < 10) {
        secs = "0" + secs;
      }
      return minutes + ":" + secs;
    },
    value(n) {
      var pounds = Math.floor(n / 100);
      var pence = n - pounds * 100;
      if (pence < 10) {
        pence = "0" + pence
      }
      return pounds + "." + pence
    },
    outOfTime(round) {
      return round.time >= this.gameState.timeLimit
    },
    playCoin(coin, role, round) {
      this.socket.emit("playCoin", {coin: coin, role: role, round: round})
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3000"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)
  }
};
</script>

<style>
thead {
  font-weight: bold;
}
.missed {
  margin-top: 12px;
  color: red;
  font-weight: bold;
}

.coin-parent {
  display: inline-block;
  height: 20px;
  width: 20px;
}
.coin {
  opacity: 0.3;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center center;
}
.played,
.customer {
  opacity: 1;
}
.one-p {
  background-image: url("../../assets/img/1p.png");
}
.two-p {
  background-image: url("../../assets/img/2p.png");
}
.five-p {
  background-image: url("../../assets/img/5p.png");
}
.ten-p {
  background-image: url("../../assets/img/10p.png");
}
.twenty-p {
  background-image: url("../../assets/img/20p.png");
}
.fifty-p {
  background-image: url("../../assets/img/50p.png");
}
.one-pound {
  background-image: url("../../assets/img/1pound.png");
}
.two-pound {
  background-image: url("../../assets/img/2pound.png");
}
</style>
