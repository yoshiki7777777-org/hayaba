<template>
    <div id="app" touch-action="none">
        <div class="dialog" v-show="state != 'run'">
            <h1 class="message">{{message}}</h1>
            <fas-button v-if="state == 'wait'" icon="play-circle" class="start" @click="onStartSelected" />
            <fas-button v-if="state == 'end'" icon="redo" class="restart" @click="onRestartSelected" />
        </div>
        <main :class="classes">
            <h4 class="title">下に表示されている絵と同じ絵を<wbr>順番に６つタップ！</h4>
            <ul class="tamolist--expected">
                <li v-for="(expectedTamoId, i) in expectedTamoIds" :key="i">
                    <icon class="tamo" :id="expectedTamoId" />
                </li>
            </ul>
            <hr class="countdown" :style="countdownStyles" />
            <ul class="tamolist--selected">
                <li v-for="(selectedTamoId, i) in selectedTamoIds" :key="i">
                    <icon class="tamo" :id="selectedTamoId" />
                </li>
                <fas-button icon="backspace" class="backspace" @click="onBSSelected" />
            </ul>
            <ul class="tamolist" v-for="(tamoIdGroup, i) in tamoIdGroups" :key="i">
                <li v-for="(tamoId, i) in tamoIdGroup" :key="i">
                    <icon class="tamo" :id="tamoId" @select="onTamoSelected" />
                </li>
            </ul>
            <button role="button" aria-label="ok" class="ok" @click="onOKSelected">OK</button>
        </main>
    </div>
</template>

<script>
import { sampleSize, chunk, shuffle, range, isEqual, clone, round } from "lodash";

import Icon from "@/Icon.vue";
import FasButton from "@/FasButton.vue";

export default {
    components: {
        Icon,
        FasButton
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
                    "main--run": this.state == "run",
                    "main--end": this.state == "end"
                }
            ];
        },
        countdownStyles() {
            return {
                width: `${this.ratioOfRemain * 100}%`
            };
        }
    },
    methods: {
        defaults() {
            return {
                tamoIds: shuffle(range(1, 11)),
                state: "wait",
                startAt: null,
                message: null,
                selectedTamoIds: [],
                intervalId: null,
                ratioOfRemain: 1
            };
        },
        onStartSelected() {
            let totalMsec = 1000 * 60;
            this.startAt = performance.now();
            this.state = "run";
            this.intervalId = setInterval(() => {
                this.ratioOfRemain = (totalMsec - (performance.now() - this.startAt)) / totalMsec;
                if (this.ratioOfRemain <= 0) {
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
            this.selectedTamoIds = this.selectedTamoIds.splice(0, this.selectedTamoIds.length - 1);
        },
        onOKSelected() {
            let expect = clone(this.expectedTamoIds).sort();
            let actual = clone(this.selectedTamoIds).sort();
            if (isEqual(expect, actual)) {
                this.message = round((performance.now() - this.startAt) / 1000, 4);
            } else {
                this.message = "(ToT)";
            }
            this.state = "end";
            clearInterval(this.intervalId);
        },
        onRestartSelected() {
            let defaults = this.defaults();
            for (const key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    this[key] = defaults[key];
                }
            }
        }
    },
    data() {
        return this.defaults();
    },
    mounted() {}
};
</script>

<style lang="scss">
$accent-color: #ffff40;

html,
body {
    width: 100%;
    height: 100%;
    font-size: 4.4vw;
}

#app {
    color: white;
    background-color: black;
    padding: 1.1rem;
    width: 100%;
    height: 100%;

    .dialog {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        padding: 1em;

        display: flex;
        align-items: center;
        justify-content: center;
        .message {
            text-align: center;
            position: absolute;
            top: 20%;
            width: 50vw;
            transform: translate(0, -50%);
        }
    }

    .main {
        display: none;
        @at-root {
            #{&}--run {
                @extend .main;
                display: flex;
                flex-direction: column;
            }
        }
        .title {
            white-space: nowrap;
        }
        .tamolist {
            margin: 1vh 0 0 0;
            position: relative;
            height: 10vh;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 0;
            list-style: none;
            .tamo {
                width: 12vw;
                :not(:first-child) {
                    margin-left: 3vw;
                }
            }
            @at-root {
                #{&}--expected {
                    @extend .tamolist;
                }
                #{&}--selected {
                    @extend .tamolist;
                    border: 1vw solid $accent-color;
                    justify-content: flex-start;
                    .tamo {
                        margin-left: 1.4vw;
                    }
                }
            }
        }
    }

    .countdown {
        height: 1rem;
        width: 100%;
        border: 0;
        background-color: $accent-color;
        margin: 2vh 0;
        box-shadow: 0 2px 1px white;
    }

    button {
        outline: none;
        -webkit-appearance: none;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .start {
        width: 100%;
        font-size: 10rem;
        background-color: transparent;
        color: darkorange;
    }
    .backspace {
        position: absolute;
        right: 0;
        width: 2rem;
        height: 100%;

        font-size: 100%;
        background-color: transparent;
        color: darkorange;
    }
    .ok {
        font-size: 1.5rem;
        margin-top: 1rem;
        background-color: darkorange;
        color: white;
        border-radius: 1vw;
        width: 50vw;
        align-self: center;
        text-shadow: 2px 2px 4px black;
    }
    .restart {
        width: 100%;
        font-size: 10rem;
        background-color: transparent;
        color: darkorange;
        animation-name: fadeIn;
        animation-duration: 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
    @keyframes fadeIn {
        50% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
