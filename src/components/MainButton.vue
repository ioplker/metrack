<template>
  <div class="container">
    <button
      id="main-btn"
      autofocus
      :disabled="!currentTask"
      class="rounded"
      @click="toggleState()"
      :class="{stop: isStarted, start: !isStarted, idle: !currentTask}"
      >{{ btnText }}</button>

    <div
      v-if="currentTask"
      class="current-task"
      >{{ currentTaskProject.name }} - {{ currentTask.name }}</div>
    <div
      v-if="currentTaskTotalTime"
      class="task-time"
      >{{ currentTaskTotalTime | hoursAndMinutes }}</div>
  </div>
</template>

<script>
  export default {
    props: [
      'isStarted',
      'currentTask',
      'currentTaskProject',
      'currentTaskTotalTime',
      'currentTaskTime',
      'projects',
    ],
    computed: {
      btnText() {
        return this.isStarted ? 'Стоп!' : 'Старт!';
      }
    },
    methods: {
      toggleState() {
        this.$emit('onBtnPress');
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    text-align: center;
    padding-top: 10px;
    button {
      width: 220px;
      height: 65px;
      border: solid 2px;
      font-style: italic;
      font-size: 24px;
      border: solid 2px;
      &.start {
        background-color: #D5E8D4;
        border-color: #82B366;
        color: #006600;
      }
      &.stop {
        background-color: #F8CECC;
        border-color: #B85450;
        color: #CC0000;
      }
      &.idle {
        background-color: #E5E5E5;
        border-color: #B9B9B9;
        color: #B9B9B9;
        cursor: not-allowed;
      }
    }
    .current-task {
      font-size: 24px;
      color: #4D4D4D;
    }
    .task-time {
      font-style: italic;
      font-size: 18px;
      color: #CCCCCC;
      line-height: 1;
    }
  }
</style>