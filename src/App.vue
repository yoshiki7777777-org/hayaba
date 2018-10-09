<template>
    <div id="app">
        <div class="dialog" v-show="state != 'run'">
            <h1>{{message}}</h1>
            <button class="start"   v-show="state == 'wait'" @click="onStartSelected">Start</button>
            <button class="restart" v-show="state == 'end'"  @click="onRestartSelected">Restart</button>
        </div>
        <main :class="classes">
            <h4>下に表示されている絵と同じ絵を順番に６つタップ！</h4>
            <ul class="tamolist expected">
                <li v-for="(expectedTamoId, i) in expectedTamoIds" :key="i">
                    <tamo :id="expectedTamoId" />
                </li>
            </ul>
            <ul class="tamolist selected">
                <li v-for="(selectedTamoId, i) in selectedTamoIds" :key="i">
                    <tamo :id="selectedTamoId" />
                </li>
            </ul>
            <button class="backspace" @click="onBSSelected">x</button>
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
import {sampleSize, chunk, shuffle, range, isEqual, clone} from "lodash"
import tamo from "@/Tamo.vue";
export default {
    components: {
        tamo
    },
    computed: {
        expectedTamoIds(){
            return sampleSize(this.tamoIds, 6);
        },
        tamoIdGroups(){
            return chunk(this.tamoIds, 5);
        },
        classes(){
            return [
                "main",
                {
                    "main--wait": this.state == "wait",
                    "main--run": this.state == "run",
                    "main--end": this.state == "end",
                }
            ]
        }
    },
    methods:{
        onStartSelected(){
            this.startAt = Date.now();
            this.state = "run";
        },
        onTamoSelected(id){
            if(this.selectedTamoIds.length < this.expectedTamoIds.length){
                this.selectedTamoIds.push(id);
            }
        },
        onBSSelected(){
            this.selectedTamoIds = this.selectedTamoIds.splice(0, this.selectedTamoIds.length - 1);
        },
        onOKSelected(){
            let expect = clone(this.expectedTamoIds).sort();
            let actual = clone(this.selectedTamoIds).sort();
            if(isEqual(expect, actual)){
                this.message = (Date.now() - this.startAt) / 1000;
            } else {
                this.message = "不一致";
            }
            this.state = "end";
        },
        onRestartSelected(){
            this.tamoIds =  shuffle(range(1, 11));
            this.state =  "wait";
            this.startAt =  null;
            this.message =  null;
            this.selectedTamoIds = [];
        }
    },
    data(){
        return {
            tamoIds: shuffle(range(1, 11)),
            state: "wait",
            startAt: null,
            message: null,
            selectedTamoIds:[],
        }
    },
    mounted(){
    }
};
</script>

<style lang="scss">

html,body{
    width:100%;
    height:100%;
}

#app {
    color:white;
    background-color:black;
    padding:1rem;
    width:100%;
    height:100%;

    .dialog {
        // position: absolute;
        left: 0; right: 0;
        width: -moz-fit-content;
        width: -webkit-fit-content;
        width: fit-content;
        // width: 100%;
        height: -moz-fit-content;
        height: -webkit-fit-content;
        height: fit-content;
        margin: auto;
        border: solid;
        padding: 1em;
        display: block;
        border: 0;
        background-color: transparent;
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
    }

    .main {
        display:none;
        &--run{
            display:block;
        }
    }

    .tamolist {
        height:16vw;
        margin:0;
        display: flex;
        align-items: center;
        padding-left:0;
        list-style: none;
    }

    .selected {
        border:1vw solid yellow;
        padding:1rem;
    }

    button {
        padding:2vw;
        outline: none;
        -webkit-appearance: none;
        background-color: aquamarine;
        color: black;
        border:1vw solid white;
    }

    .start {
        border-radius: 50%;
        width:80vw;
        height:80vw;
    }
    .ok{
        width:100%;
    }
    .restart{
        width:100%;
    }
}
</style>
