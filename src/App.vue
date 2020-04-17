<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
  line-height: unset;
}
.tile {
  border: 1px solid #000000;
  border-radius: 8px;
}
.header {
  font-size: 20px;
  font-style: italic;
  text-align: center;
  color: #000000;
  .alt-text {
    color: #808080;
  }
}
</style>