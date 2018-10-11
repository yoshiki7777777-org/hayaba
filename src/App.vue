<template>
    <div id="app" touch-action="none">
        <div class="dialog" v-show="state != 'run'">
            <h1 class="message">{{message}}</h1>
            <button class="start"   v-show="state == 'wait'" @click="onStartSelected">Start</button>
            <button class="restart" v-show="state == 'end'"  @click="onRestartSelected">Restart</button>
        </div>
        <main :class="classes">
            <h4>下に表示されている絵と同じ絵を</h4>
            <h4>順番に６つタップ！</h4>
            <ul class="tamolist--expected">
                <li v-for="(expectedTamoId, i) in expectedTamoIds" :key="i">
                    <tamo :id="expectedTamoId" />
                </li>
            </ul>
            <hr class="countdown" :style="countdownStyles"/>
            <ul class="tamolist--selected">
                <li v-for="(selectedTamoId, i) in selectedTamoIds" :key="i">
                    <tamo :id="selectedTamoId" />
                </li>
                <button class="backspace" @click="onBSSelected">x</button>
            </ul>
            <ul class="tamolist" v-for="(tamoIdGroup, i) in tamoIdGroups" :key="i">
                <li v-for="(tamoId, i) in tamoIdGroup" :key="i">
                    <tamo :id="tamoId" @select="onTamoSelected"/>
                </li>
            </ul>
            <button class="ok" @click="onOKSelected">OK</button>
        </main>
    </div>
</template>

<script>
import { sampleSize, chunk, shuffle, range, isEqual, clone, round } from "lodash";
import tamo from "@/Tamo.vue";
export default {
  components: {
    tamo
  },
  computed: {
    expectedTamoIds() {
      return sampleSize(this.tamoIds, 6);
    },
    tamoIdGroups() {
      return chunk(this.tamoIds, 5);
    },
    classes() {
      return [
        "main",
        {
          "main--wait": this.state == "wait",
          "main--run":  this.state == "run",
          "main--end":  this.state == "end"
        }
      ];
    },
    countdownStyles(){
        return {
            width:`${this.ratioOfRemain * 100}%`
        }
    }
  },
  methods: {
    onStartSelected() {
      let totalMsec = 1000 * 60;
      this.startAt = performance.now();
      this.state = "run";
      this.intervalId = setInterval(()=>{
          this.ratioOfRemain = (totalMsec - (performance.now() - this.startAt)) / totalMsec;
          if(this.ratioOfRemain <= 0){
              this.onOKSelected();
          }
      }, 100);
    },
    onTamoSelected(id) {
      if (this.selectedTamoIds.length < this.expectedTamoIds.length) {
        this.selectedTamoIds.push(id);
      }
    },
    onBSSelected() {
      this.selectedTamoIds = this.selectedTamoIds.splice(
        0,
        this.selectedTamoIds.length - 1
      );
    },
    onOKSelected() {
      let expect = clone(this.expectedTamoIds).sort();
      let actual = clone(this.selectedTamoIds).sort();
      if (isEqual(expect, actual)) {
        this.message = round((performance.now() - this.startAt) / 1000, 4);
      } else {
        this.message = "不一致";
      }
      this.state = "end";
      clearInterval(this.intervalId);
    },
    onRestartSelected() {
      this.tamoIds = shuffle(range(1, 11));
      this.state = "wait";
      this.startAt = null;
      this.message = null;
      this.selectedTamoIds = [];
      this.intervalId = null;
      this.ratioOfRemain = 1;
    }
  },
  data() {
    return {
      tamoIds: shuffle(range(1, 11)),
      state: "wait",
      startAt: null,
      message: null,
      selectedTamoIds: [],
      intervalId: null,
      ratioOfRemain: 1,
    };
  },
  mounted() {}
};
</script>

<style lang="scss">

$accent-color:yellow;

html,
body {
  width: 100%;
  height: 100%;
  font-size: 4.4vw;
}

#app {
  color: white;
  background-color: black;
  padding: 1rem;
  width: 100%;
  height: 100%;

  .dialog {
    position: absolute;
    left: 0;
    right: 0;
    width: -moz-fit-content;
    width: -webkit-fit-content;
    width: fit-content;
    height: -moz-fit-content;
    height: -webkit-fit-content;
    height: fit-content;
    margin: auto;
    border: 0;
    padding: 1em;
    display: block;

    position: fixed;
    top: 50%;
    transform: translate(0, -50%);

    padding: 1em;
    .message {
      width: 80vw;
    }
  }

  .main {
    display: none;
    &--run {
      display: flex;
      flex-direction: column;
    }
  }

  .tamolist {
    position: relative;
    height: 16vw;
    margin: 0;
    display: flex;
    align-items: center;
    padding-left: 0;
    list-style: none;
    @at-root {
      #{&}--expected {
        @extend .tamolist;
      }
      #{&}--selected {
        @extend .tamolist;
        border: 1vw solid $accent-color;
      }
    }
  }

  .countdown{
      height:1rem;
      width:100%;
      border:0;
      background-color:$accent-color;
      margin: 2vh 0;
  }

  button {
    font-size: 1.2rem;
    padding: 2vw;
    outline: none;
    -webkit-appearance: none;
    background-color: darkorange;
    color: black;
    border: 1vw solid white;
  }

  .start {
    border-radius: 50%;
    width: 80vw;
    height: 80vw;
  }
  .backspace {
    position: absolute;
    right: 0;
    width:2rem;
  }
  .ok {
    width: 100%;
  }
  .restart {
    width: 100%;
  }
}
</style>
