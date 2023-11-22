<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/store/index";

// access the `store` variable anywhere in the component ✨
const store = useGlobalStore();
const { getData } = storeToRefs(store);

let selected = ref([]);
let show = ref(false);
let shadow = ref(null);
let shadowIndex = ref(null);
let transferType = ref(null);
let deletedRow = ref(null);

function add(item) {
  selected.value.push(item);
  show.value = false;
}
function clear() {
  shadow.value = null;
  deletedRow.value = null;
  shadowIndex.value = null;
}

function startDrag(item, myrow, type) {
  transferType.value = type;
  if (transferType.value === "columnTransfer") {
    shadow.value = item;
    deletedRow.value = myrow;
  } else if (transferType.value === "rowTransfer") {
    shadow.value = item;
    shadowIndex.value = myrow;
  }
}
function onDrop(list) {
  if (list.id === shadow.value.id) {
    clear();
    return;
  }
  if (transferType.value === "columnTransfer") {
    selected.value.filter((item, index) => {
      if (item.id === list.id) {
        selected.value[index].kolon.push(shadow.value);
      }
      if (item.id === deletedRow.value.id) {
        item.kolon.filter((row, index) => {
          if (row.id === shadow.value.id) {
            item.kolon.splice(index, 1);
          }
        });
      }
    });
  } else if (transferType.value === "rowTransfer") {
    selected.value.splice(shadowIndex.value, 1);
    let counter = 0;
    selected.value.filter((item, index) => {
      if (item.id === list.id) {
        counter++;
        if (counter === 1) {
          selected.value.splice(index, 0, shadow.value);
        }
        return
      }
    });
  }
}
function deleteRow(row) {
  selected.value.filter((item, index) => {
    if (item.id === row.id) {
      selected.value.splice(index, 1);
    }
  });
}
</script>

<template>
  <v-app>
    <v-container>
      <!-- row display area -->
      <div
        v-for="(row, index) in selected"
        :key="index + row"
        :draggable="true"
        @drop="onDrop(row)"
        @dragover.prevent
        class="position-relative myRow my-5"
      >
        <div class="outline">
          <v-btn
            class="position-absolute shuffle-btn"
            size="small"
            color="primary"
            icon="mdi-dots-grid"
            :draggable="true"
            @dragstart="startDrag(row, index, 'rowTransfer')"
          ></v-btn>
          <v-btn
            class="position-absolute delete-btn"
            size="small"
            color="error"
            icon="mdi-delete"
            @click="deleteRow(row)"
          ></v-btn>
        </div>
        <div class="d-flex py-2 movable">
          <v-card
            variant="outlined"
            class="mx-1 selected"
            v-for="(kolon, index) in row.kolon"
            :key="index + kolon"
            :width="'100%'"
            :draggable="true"
            @dragstart="startDrag(kolon, row, 'columnTransfer')"
            @dragenter.prevent
          >
            +
          </v-card>
        </div>
      </div>

      <!-- line insertion area -->
      <div
        class="d-flex align-center justify-center flex-column add mt-10"
        v-if="!show"
      >
        <v-btn
          class="ma-2"
          @click="show = !show"
          icon="mdi-plus"
          color="indigo-darken-3"
        ></v-btn>
        <v-btn variant="text" @click="show = !show">Yeni Satır Ekle </v-btn>
      </div>
      <div v-if="show" class="mt-15">
        <v-card variant="outlined" class="pa-5">
          <v-btn
            variant="plain"
            class="close"
            @click="show = !show"
            icon="mdi-close"
          ></v-btn>
          <v-card-title class="text-uppercase"
            >Satır Yapısını Seçin</v-card-title
          >
          <svg
            class="filter pointer"
            v-for="(item, index) in getData"
            :key="index + item"
            @click="add(item)"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            height="100px"
            width="15%"
            viewBox="0 0 150 50"
            color=""
          >
            <path :d="item.svgattr" />
          </svg>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #072e55;
  margin-top: 60px;
}
.filter {
  fill: rgb(218, 222, 226);
}
.filter:hover {
  fill: rgb(55, 55, 55);
}
.add {
  border: 1px dotted black;
  padding: 25px;
}
.selected {
  cursor: all-scroll;
}
.pointer {
  cursor: pointer;
}
.outline {
  position: absolute;
  border: 2px solid rgb(72, 168, 193);
  border-radius: 5px;
  height: 42px;
  width: 100%;
  opacity: 0;
}

.shuffle-btn {
  top: -42.5px;
  left: 47%;
}
.delete-btn {
  top: -42.5px;
  left: 50.5%;
}
.myRow:hover > .outline {
  opacity: 1;
}
.movable {
  z-index: 2;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>